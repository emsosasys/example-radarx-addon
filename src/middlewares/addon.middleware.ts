import { NextFunction, Request, Response } from "express"

export const getAddonQS = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.addon) {
    req.session.addon = {}
  }

  if (req.query.courseId) {
    req.session.addon = { ...req.query }

    req.session.save((err) => {
      if (err) {
        console.error("Error al guardar la sesión:", err)
      }
    })
  }

  next()
}
