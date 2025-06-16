import env from "@/config/env"
import {
  getOAuthClient,
  getAuthURL,
  generateSecureState,
} from "@/helpers/oauth"
import { User } from "@/types/user"
import { encrypt } from "@/utils/encryption"
import { RadarXService } from "./radarx.service"
import { CustomError } from "@/helpers/appError"

export class AuthService {
  static async generateAuthUrl(
    login_hint?: string,
  ): Promise<{ url: string; state: string }> {
    const state = generateSecureState()
    const url = await getAuthURL(state, login_hint)
    return { url, state }
  }

  static async processCallback(
    code: string | undefined,
    receivedState: string,
    savedState: string | undefined,
  ): Promise<{ user: User; encryptedTokens: string }> {
    if (!code || typeof code !== "string") {
      throw new CustomError("Código de autorización inválido", 401)
    }

    if (!savedState || receivedState !== savedState) {
      throw new CustomError("Estado inválido", 401)
    }

    const oauth2Client = await getOAuthClient()
    const { tokens } = await oauth2Client.getToken(code)

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token as string,
      audience: env.GOOGLE_CLIENT_ID,
    })

    const info = ticket.getPayload()

    const radaxService = new RadarXService()

    let user: User = {
      sub: info?.sub ?? "",
      email: info?.email ?? "",
      fullName: info?.name ?? "Guest",
      firstName: info?.given_name ?? "",
      lastName: info?.family_name ?? "",
      photoURL: info?.picture ?? "",
      refresh_token: tokens.refresh_token ?? "",
    }

    if (user.email) {
      const {
        success,
        data: profile,
        error,
      } = await radaxService.getProfileByEmail(user.email)

      console.log("Auth service: ", error)

      if (!success || !profile || error) {
        throw new CustomError("Usuario no registrado.", 401)
      }

      user = {
        ...user,
        role: profile.Role.name,
        is_active: profile.is_active,
      }
    }

    const encryptedTokens = encrypt(JSON.stringify(tokens))
    return { user, encryptedTokens }
  }
}
