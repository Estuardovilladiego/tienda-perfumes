import { requireAdminApi } from "@/lib/admin-auth";
import { ajustarInventarioAdmin, listarInventarioAdmin } from "@/lib/admin-data";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  return Response.json({ ok: true, data: await listarInventarioAdmin() });
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const body = (await request.json().catch(() => null)) as
    | { productoId?: number; modo?: "ajustar" | "incrementar" | "reducir"; cantidad?: number; motivo?: string }
    | null;
  if (!body?.productoId || !body.modo || body.cantidad === undefined) {
    return Response.json({ ok: false, error: "Datos incompletos" }, { status: 400 });
  }

  try {
    const producto = await ajustarInventarioAdmin(
      Number(body.productoId),
      body.modo,
      Number(body.cantidad),
      body.motivo
    );
    return Response.json({ ok: true, data: producto });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo ajustar inventario";
    return Response.json({ ok: false, error: message }, { status: 400 });
  }
}
