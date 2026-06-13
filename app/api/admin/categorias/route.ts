import { requireAdminApi } from "@/lib/admin-auth";
import { guardarCategoriaAdmin, listarCategoriasAdmin } from "@/lib/admin-data";
import { validateCategoriaAdmin } from "@/lib/admin-validation";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  return Response.json({ ok: true, data: await listarCategoriasAdmin() });
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ ok: false, error: "JSON invalido" }, { status: 400 });

  const validation = validateCategoriaAdmin(body);
  if (!validation.ok) {
    return Response.json({ ok: false, errors: validation.errors }, { status: 400 });
  }

  try {
    return Response.json({ ok: true, data: await guardarCategoriaAdmin(validation.input) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo guardar la categoria";
    return Response.json({ ok: false, error: message }, { status: 400 });
  }
}
