import express from "express"
import {
  closePopUp,
  getAuthCallback,
  getAuthUrl,
  signIn,
  signOut,
} from "@/controllers/auth.controller"
import { authErrorHandler } from "@/middlewares/authError.middleware"
import { redirectIfAuthenticated } from "@/middlewares/auth.middleware"

const router = express.Router()

router.get("/google", getAuthUrl)

router.get("/google/oauth2callback", getAuthCallback)

router.get("/signin", redirectIfAuthenticated, signIn)

router.get("/signout", signOut)

router.get("/closepopup", closePopUp)

router.get("*", (_req, res) => {
  res.redirect("/auth/signin")
})

router.use(authErrorHandler)

export default router
