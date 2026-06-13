import { requireAdminApi } from "@/lib/admin-auth";
import { getDashboardAdmin } from "@/lib/admin-data";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  return Response.json({ ok: true, data: await getDashboardAdmin() });
}
