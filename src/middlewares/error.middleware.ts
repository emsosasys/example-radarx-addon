import type { Request, Response, NextFunction } from "express"
import { AppError } from "@/utils/errors"

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message })
  } else {
    console.error(err)
    res.status(500).json({ error: "Internal server error" })
  }
  next()
}
