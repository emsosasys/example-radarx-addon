import { randomBytes } from "crypto"
import { google, Auth } from "googleapis"
import { constants } from "@/config/constants"
import env from "@/config/env"

export const generateSecureState = (size: number = 32): string => {
  const buffer = randomBytes(size)

  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
}

export const getOAuthClient = async (): Promise<Auth.OAuth2Client> => {
  const options: Auth.OAuth2ClientOptions = {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    redirectUri: env.GOOGLE_REDIRECT_URI,
  }

  if (!options.clientId || !options.clientSecret || !options.redirectUri) {
    throw new Error("Missing required Google OAuth2 configuration")
  }

  return new google.auth.OAuth2(
    options.clientId,
    options.clientSecret,
    options.redirectUri,
  )
}

export const getAuthURL = async (
  state?: string,
  login_hint?: string,
): Promise<string> => {
  const oauth2Client = await getOAuthClient()
  const secureState = state || generateSecureState()

  const authUrlConfig: Auth.GenerateAuthUrlOpts = {
    access_type: "offline",
    prompt: "consent",
    scope: constants.SCOPES,
    include_granted_scopes: true,
    state: secureState,
    login_hint,
  }

  return oauth2Client.generateAuthUrl(authUrlConfig)
}
