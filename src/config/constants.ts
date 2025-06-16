import path from "node:path"

const SCOPES = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/classroom.rosters.readonly",
  "https://www.googleapis.com/auth/classroom.courses.readonly",
  "https://www.googleapis.com/auth/classroom.addons.student",
  "https://www.googleapis.com/auth/classroom.addons.teacher",
]

const CREDENTIALS_PATH = path.join(process.cwd(), "client_secret.json")

export const constants = {
  SCOPES,
  CREDENTIALS_PATH,
}
