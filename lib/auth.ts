import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "crypto";
import { getDb } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session-config";
import type { AdminUser } from "@/lib/types";

function secret(): string {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SESSION_SECRET is required in production");
  }
  return value || "development-only-session-secret";
}

function base64url(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}
function fromBase64url(input: string): string {
  return Buffer.from(input, "base64url").toString("utf8");
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

type SessionPayload = { u: string; exp: number };

export function createSessionToken(username: string): string {
  const payload: SessionPayload = {
    u: username,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  };
  const body = base64url(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

export function verifySessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(fromBase64url(body)) as SessionPayload;
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload.u;
  } catch {
    return null;
  }
}

/** اعتبارسنجی نام‌کاربری/رمز در برابر جدول users. در صورت موفقیت، نام‌کاربری برمی‌گردد. */
export function verifyCredentials(
  username: string,
  password: string
): string | null {
  const user = getDb()
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(username) as AdminUser | undefined;
  if (!user) return null;
  if (!verifyPassword(password, user.password_hash)) return null;
  return user.username;
}

/** نام‌کاربری نشست جاری یا null (بررسی معتبرِ سمت‌سرور). */
export async function getSessionUser(): Promise<string | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function setSession(username: string): Promise<void> {
  // به‌طور پیش‌فرض در تولید کوکی فقط روی HTTPS ارسال می‌شود. اگر سایت شما روی
  // HTTP بدون SSL است، COOKIE_SECURE=false را در متغیرهای محیطی تنظیم کنید.
  const secure =
    process.env.COOKIE_SECURE !== undefined
      ? process.env.COOKIE_SECURE === "true"
      : process.env.NODE_ENV === "production";
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(username), {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** در صورت نبود نشست معتبر، به صفحه‌ی ورود هدایت می‌کند؛ در غیر این صورت نام‌کاربری. */
export async function requireAdmin(): Promise<string> {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return user;
}
