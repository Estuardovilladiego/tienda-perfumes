import { requireAdminApi } from "@/lib/admin-auth";
import { adminDbErrorMessage } from "@/lib/admin-api-error";
import {
  eliminarProductoAdmin,
  guardarProductoAdmin,
  obtenerProductoAdmin,
} from "@/lib/admin-data";
import { revalidateCatalogo } from "@/lib/revalidate-catalogo";
import { validateProductoAdmin } from "@/lib/admin-validation";

type Params = { params: Promise<{ id: string }> };

function parseId(id: string) {
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function GET(_request: Request, { params }: Params) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const id = parseId((await params).id);
  if (!id) return Response.json({ ok: false, error: "ID invalido" }, { status: 400 });

  const producto = await obtenerProductoAdmin(id);
  if (!producto) return Response.json({ ok: false, error: "Producto no encontrado" }, { status: 404 });
  return Response.json({ ok: true, data: producto });
}

export async function PUT(request: Request, { params }: Params) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const id = parseId((await params).id);
  if (!id) return Response.json({ ok: false, error: "ID invalido" }, { status: 400 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ ok: false, error: "JSON invalido" }, { status: 400 });

  const validation = validateProductoAdmin(body);
  if (!validation.ok) {
    return Response.json({ ok: false, errors: validation.errors }, { status: 400 });
  }

  try {
    const data = await guardarProductoAdmin(validation.input, id);
    revalidateCatalogo();
    return Response.json({ ok: true, data });
  } catch (error) {
    const message = adminDbErrorMessage(error, "No se pudo actualizar el producto");
    return Response.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const id = parseId((await params).id);
  if (!id) return Response.json({ ok: false, error: "ID invalido" }, { status: 400 });

  await eliminarProductoAdmin(id);
  revalidateCatalogo();
  return Response.json({ ok: true });
}
