import express from "express"

import authRoutes from "@/routes/auth.routes"
import addonRoutes from "@/routes/addon.routes"
import { attachTokens, isAuthenticated } from "@/middlewares/auth.middleware"
import { getAddonQS } from "@/middlewares/addon.middleware"

const router = express.Router()

router.use("/auth", authRoutes)
router.use("/", [getAddonQS, isAuthenticated, attachTokens], addonRoutes)

export default router
