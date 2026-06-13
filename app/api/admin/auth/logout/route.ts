import { logoutAdmin, requireAdminApi } from "@/lib/admin-auth";

export async function POST() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  await logoutAdmin();
  return Response.json({ ok: true });
}
