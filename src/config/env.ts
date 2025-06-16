import dotenv from "dotenv"
import { z } from "zod"

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"], {
      message: "NODE_ENV must be 'development', 'test', or 'production'",
    })
    .default("development"),
  PORT: z
    .string()
    .default("8080")
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0 && val <= 65535, {
      message: "PORT must be a valid number between 1 and 65535",
    }),
  CLIENT_URL: z
    .string()
    .url({ message: "CLIENT_URL must be a valid URL" })
    .default("https://addon-local.dev:8080"),
  GOOGLE_CLIENT_ID: z
    .string()
    .min(1, { message: "GOOGLE_CLIENT_ID is required" })
    .refine((val) => val.includes(".apps.googleusercontent.com"), {
      message: "GOOGLE_CLIENT_ID must be a valid Google client ID",
    }),
  GOOGLE_CLIENT_SECRET: z.string().min(1, {
    message: "GOOGLE_CLIENT_SECRET is required",
  }),
  GOOGLE_REDIRECT_URI: z
    .string()
    .url({ message: "GOOGLE_REDIRECT_URI must be a valid URL" }),
  ENCRYPTION_KEY: z
    .string()
    .min(32, { message: "ENCRYPTION_KEY must be exactly 32 bytes" })
    .max(32, { message: "ENCRYPTION_KEY must be exactly 32 bytes" })
    .refine((val) => Buffer.from(val).length === 32, {
      message: "ENCRYPTION_KEY must be exactly 32 bytes",
    }),
  SESSION_SECRET: z.string().min(1, { message: "SESSION_SECRET is required" }),
  RADAR_X_API_KEY: z
    .string()
    .min(1, { message: "RADAR_X_API_KEY is required" }),
  RADAR_X_URL: z
    .string()
    .url({ message: "RADAR_X_URI must be a valid URL" })
    .default("http://localhost:5000"),
})

export type Env = z.infer<typeof envSchema>

let env: Env

try {
  env = envSchema.parse(process.env)
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("Errores de validación de variables de entorno:")
    error.errors.forEach((err) => {
      console.error(`- ${err.path.join(".")}: ${err.message}`)
    })
    process.exit(1)
  }
  throw error
}

export default env
