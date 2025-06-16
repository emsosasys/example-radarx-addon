import { Tokens } from "@/types/token"

declare module "express" {
  interface Request {
    tokens?: Tokens
  }
}
