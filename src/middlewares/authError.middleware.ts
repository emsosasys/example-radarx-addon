import { CustomError } from "@/helpers/appError"
import { Request, Response, NextFunction, ErrorRequestHandler } from "express"

export const authErrorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    next(err)
    return
  }

  if (err instanceof CustomError) {
    return res.render("auth/oauth-popup-result", {
      title: "Autenticación",
      success: false,
      message:
        err instanceof Error
          ? err.message
          : "Algo salió mal durante la autenticación.",
    })
  }

  res.status(500).render("auth/oauth-popup-result", {
    title: "Autenticación",
    success: false,
    message:
      err instanceof Error
        ? err.message
        : "Algo salió mal durante la autenticación.",
  })
}
