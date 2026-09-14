import "server-only";
import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

/**
 * هش رمز عبور با scrypt داخلی Node (بدون وابستگی خارجی).
 * قالب ذخیره‌شده: «salt:derivedKey» به‌صورت hex.
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  let derived: Buffer;
  try {
    derived = scryptSync(password, salt, 64);
  } catch {
    return false;
  }
  const keyBuf = Buffer.from(key, "hex");
  if (keyBuf.length !== derived.length) return false;
  return timingSafeEqual(keyBuf, derived);
}
