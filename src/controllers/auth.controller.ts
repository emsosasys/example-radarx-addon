import { NextFunction, Request, Response } from "express"
import { AuthService } from "@/services/auth.service"
import { SessionService } from "@/services/session.service"
import { CustomError } from "@/helpers/appError"

export const getAuthUrl = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const login_hint = req.session.addon?.login_hint

  try {
    const { url, state } = await AuthService.generateAuthUrl(login_hint)
    SessionService.setOAuthStateCookie(res, state)
    res.redirect(url)
  } catch (error) {
    console.error("Error generando URL de autenticación:", error)
    next(error)
  }
}

export const getAuthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const errorFromGoogle = req.query.error as string | undefined

    if (errorFromGoogle) {
      console.error("Error from Google:", errorFromGoogle)
      throw new CustomError(errorFromGoogle, 400)
    }

    const receivedState = req.query.state as string
    const savedState = req.cookies.oauth_state
    const code = req.query?.code as string | undefined

    const { user, encryptedTokens } = await AuthService.processCallback(
      code,
      receivedState,
      savedState,
    )

    SessionService.saveUserSession(req, user, encryptedTokens)
    SessionService.clearOAuthStateCookie(res)

    res.redirect("/auth/closepopup")
  } catch (error) {
    next(error)
  }
}

export const signOut = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.session) {
      const preservedRedirectTo = req.session.redirectTo || "/"
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err)
          return next(err)
        }

        res.clearCookie("connect.sid")
        res.clearCookie("oauth_state", { path: "/" })

        const redirectUrl = preservedRedirectTo.startsWith("/")
          ? preservedRedirectTo
          : "/"

        res.redirect(
          `/auth/signin?redirectTo=${encodeURIComponent(redirectUrl)}`,
        )
      })
    } else {
      res.redirect("/auth/signin")
    }
  } catch (error) {
    console.error("Error during sign out:", error)
    next(error)
  }
}

export const signIn = async (req: Request, res: Response) => {
  const redirectTo =
    req.session.redirectTo ?? (req.query.redirectTo as string) ?? "/"

  const message = req.flash("error")

  res.render("auth/signin", {
    title: "Iniciar sesión",
    redirectTo: decodeURIComponent(redirectTo),
    error: message[0] ?? null,
  })
}

export const closePopUp = async (_req: Request, res: Response) => {
  res.render("auth/oauth-popup-result", {
    success: true,
    message: null,
  })
}
