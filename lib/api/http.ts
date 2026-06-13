import { NextResponse } from "next/server";

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export function parseJsonBody<T>(body: unknown): T | null {
  if (!body || typeof body !== "object") return null;
  return body as T;
}
