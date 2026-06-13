import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "essenza_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 8;

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (secret) return secret;

  if (process.env.VERCEL === "1" || process.env.VERCEL_ENV === "production") {
    return "";
  }

  return process.env.ADMIN_PASSWORD || "";
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return aBuffer.length === bBuffer.length && timingSafeEqual(aBuffer, bBuffer);
}

function createSessionValue(email: string) {
  const payload = Buffer.from(
    JSON.stringify({ email, exp: Date.now() + MAX_AGE_SECONDS * 1000 })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export async function isAdminAuthenticated() {
  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredEmail || !configuredPassword || !getSecret()) return false;

  const value = (await cookies()).get(COOKIE_NAME)?.value;
  if (!value) return false;

  const [payload, signature] = value.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) {
    return false;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      email?: string;
      exp?: number;
    };
    return session.email === configuredEmail && Number(session.exp) > Date.now();
  } catch {
    return false;
  }
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
}

export async function requireAdminApi() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }
  return null;
}

export async function loginAdmin(email: string, password: string) {
  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const configuredPassword = process.env.ADMIN_PASSWORD;
  const emailOk = configuredEmail ? email.trim().toLowerCase() === configuredEmail : false;
  const passwordOk =
    configuredPassword && password
      ? safeEqual(password, configuredPassword)
      : false;

  if (!emailOk || !passwordOk) return false;

  (await cookies()).set(COOKIE_NAME, createSessionValue(configuredEmail!), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });

  return true;
}

export async function logoutAdmin() {
  (await cookies()).set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
