import { requireAdminApi } from "@/lib/admin-auth";
import { listarPedidosAdmin } from "@/lib/admin-data";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  return Response.json({ ok: true, data: await listarPedidosAdmin() });
}
