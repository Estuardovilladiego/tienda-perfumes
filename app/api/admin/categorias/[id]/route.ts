import { requireAdminApi } from "@/lib/admin-auth";
import { eliminarCategoriaAdmin, guardarCategoriaAdmin } from "@/lib/admin-data";
import { validateCategoriaAdmin } from "@/lib/admin-validation";

type Params = { params: Promise<{ id: string }> };

function parseId(id: string) {
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function PUT(request: Request, { params }: Params) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const id = parseId((await params).id);
  if (!id) return Response.json({ ok: false, error: "ID invalido" }, { status: 400 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ ok: false, error: "JSON invalido" }, { status: 400 });

  const validation = validateCategoriaAdmin(body);
  if (!validation.ok) {
    return Response.json({ ok: false, errors: validation.errors }, { status: 400 });
  }

  try {
    return Response.json({ ok: true, data: await guardarCategoriaAdmin(validation.input, id) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo actualizar la categoria";
    return Response.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const id = parseId((await params).id);
  if (!id) return Response.json({ ok: false, error: "ID invalido" }, { status: 400 });

  try {
    await eliminarCategoriaAdmin(id);
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { ok: false, error: "No se puede eliminar una categoria con productos asociados" },
      { status: 409 }
    );
  }
}
