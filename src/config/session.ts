import path from "path"
import fs from "fs"
import session from "express-session"
import FileStore from "session-file-store"
import env from "@/config/env"

const FileStoreInstance = FileStore(session)

const sessionsDir = path.resolve(__dirname, "../../sessions")
if (!fs.existsSync(sessionsDir)) {
  fs.mkdirSync(sessionsDir, { recursive: true })
}

const sessionStore = new FileStoreInstance({
  path: sessionsDir,
  ttl: 24 * 60 * 60, // 1 day
  retries: 5,
  secret: process.env.SESSION_SECRET,
})

const configureSession = () => {
  return session({
    // store: sessionStore,
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
}

export default configureSession
