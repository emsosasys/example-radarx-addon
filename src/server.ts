console.clear()
import { httpServer } from "@/app"
import env from "@/config/env"

const PORT = env.PORT ?? 8081

const startServer = async () => {
  try {
    httpServer.listen(PORT, "addon-local.dev", () => {
      console.log(`⚡ https://addon-local.dev:${PORT}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()
