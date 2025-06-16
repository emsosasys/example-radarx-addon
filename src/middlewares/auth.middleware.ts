import { Tokens } from "@/types/token"
import { decrypt } from "@/utils/encryption"
import { Request, Response, NextFunction } from "express"

export function redirectIfAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const user = req.session.user
  const tokens = req.session.tokens
  const redirectTo = req.session.redirectTo

  if (user && tokens && redirectTo) {
    return res.redirect(redirectTo ?? "/")
  }

  next()
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.session.redirectTo) {
    req.session.redirectTo = req.originalUrl
  }

  if (!req.session.user || !req.session.tokens) {
    res.redirect(`/auth/signin`)
    return
  }

  const addon = req.session.addon || {}
  const login_hint = addon.login_hint

  if (login_hint && req.session.user.sub !== login_hint) {
    req.session.user = undefined
    req.session.tokens = undefined
    addon.login_hint = undefined
    req.session.redirectTo = undefined

    req.flash("error", "Ocurrió un problema. Inicia sesión de nuevo.")

    res.redirect(`/auth/signin`)
    return
  }

  try {
    const decryptedTokens = decrypt(req.session.tokens)
    const tokens: Tokens = JSON.parse(decryptedTokens)

    if (tokens.expiry_date && tokens.expiry_date < Date.now()) {
      req.flash(
        "error",
        "Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.",
      )
      req.session.user = undefined
      req.session.tokens = undefined

      res.redirect("/auth/signin")
      return
    }

    next()
  } catch (err) {
    console.error("Error al verificar los tokens:", err)
    res.render("auth/error", {
      message: "Error interno al verificar la autenticación",
    })
  }
}

export function attachTokens(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (req.session.tokens) {
    try {
      const decryptedTokens = decrypt(req.session.tokens)
      const tokens: Tokens = JSON.parse(decryptedTokens)
      req.tokens = tokens
    } catch (err) {
      console.error("Error al desencriptar los tokens:", err)
    }
  }
  next()
}
