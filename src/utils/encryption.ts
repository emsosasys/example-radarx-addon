import crypto from "crypto"
import env from "@/config/env"

export const encrypt = (text: string): string => {
  const initialVector = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(env.ENCRYPTION_KEY),
    initialVector,
  )
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])

  return initialVector.toString("hex") + ":" + encrypted.toString("hex")
}

export function decrypt(text: string): string {
  const [iv, encryptedText] = text.split(":")
  const ivBuffer = Buffer.from(iv, "hex")
  const encryptedBuffer = Buffer.from(encryptedText, "hex")
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(env.ENCRYPTION_KEY),
    ivBuffer,
  )
  let decrypted = decipher.update(encryptedBuffer)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}
