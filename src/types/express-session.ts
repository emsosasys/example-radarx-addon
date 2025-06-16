import { AddonParams } from "./addon"
import { User } from "./user"

declare module "express-session" {
  interface SessionData {
    [key: string]: unknown
    user?: User
    tokens?: string
    addon?: AddonParams
    redirectTo?: string
  }
}
