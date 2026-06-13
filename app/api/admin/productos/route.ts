import { requireAdminApi } from "@/lib/admin-auth";
import { adminDbErrorMessage } from "@/lib/admin-api-error";
import { guardarProductoAdmin, listarProductosAdmin } from "@/lib/admin-data";
import { revalidateCatalogo } from "@/lib/revalidate-catalogo";
import { validateProductoAdmin } from "@/lib/admin-validation";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  return Response.json({ ok: true, data: await listarProductosAdmin() });
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ ok: false, error: "JSON invalido" }, { status: 400 });

  const validation = validateProductoAdmin(body);
  if (!validation.ok) {
    return Response.json({ ok: false, errors: validation.errors }, { status: 400 });
  }

  try {
    const data = await guardarProductoAdmin(validation.input);
    revalidateCatalogo();
    return Response.json({ ok: true, data }, { status: 201 });
  } catch (error) {
    const message = adminDbErrorMessage(error, "No se pudo guardar el producto");
    return Response.json({ ok: false, error: message }, { status: 400 });
  }
}
