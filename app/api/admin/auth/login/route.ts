import { loginAdmin } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string }
    | null;

  if (!body?.email || !body.password) {
    return Response.json({ ok: false, error: "Email y password son obligatorios" }, { status: 400 });
  }

  const ok = await loginAdmin(body.email, body.password);
  if (!ok) {
    return Response.json({ ok: false, error: "Credenciales invalidas" }, { status: 401 });
  }

  return Response.json({ ok: true });
}
