import { createServer } from "https"
import fs from "node:fs"
import path from "path"
import express from "express"
import cors from "cors"
import morgan from "morgan"
import compression from "compression"
import ejsLayouts from "express-ejs-layouts"
import cookieParser from "cookie-parser"
import flash from "express-flash"

import env from "@/config/env"
import routes from "@/routes"
import { errorMiddleware } from "@/middlewares/error.middleware"
import configureSession from "./config/session"

const options = {
  key: fs.readFileSync(
    path.join(__dirname, "..", "./certs/addon-local.dev.key"),
    "utf8",
  ),
  cert: fs.readFileSync(
    path.join(__dirname, "..", "./certs/addon-local.dev.crt"),
    "utf8",
  ),
}

const app = express()
const httpServer = createServer(options, app)

app.set("trust proxy", 1)

app.use(morgan("dev"))
app.use(cookieParser())
app.use(configureSession())

app.use(flash())

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(ejsLayouts)
app.set("layout", "layouts/base")

app.use(express.static(path.join(__dirname, "..", "/public")))

app.use(
  cors({
    origin: [env.CLIENT_URL],
    credentials: true,
  }),
)

app.use(compression())

app.use(express.urlencoded({ extended: true }))

app.use(errorMiddleware)

app.use("/", routes)

export { app, httpServer }
