import env from '@/config/env'
import { User } from '@/types/user'
import { Request, Response } from 'express'

export class SessionService {
  static setOAuthStateCookie(res: Response, state: string): void {
    res.cookie('oauth_state', state, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 5 * 60 * 1000,
    })
  }

  static saveUserSession(
    req: Request,
    user: User,
    encryptedTokens: string
  ): void {
    req.session.user = user
    req.session.tokens = encryptedTokens
  }

  static clearOAuthStateCookie(res: Response): void {
    res.clearCookie('oauth_state')
  }
}
