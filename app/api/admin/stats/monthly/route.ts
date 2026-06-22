import { requireAdminApi } from "@/lib/admin-auth";
import { getMonthlyStatsAdmin } from "@/lib/admin-data";

function parseMonthYear(searchParams: URLSearchParams) {
  const now = new Date();
  const monthRaw = searchParams.get("month");
  const yearRaw = searchParams.get("year");

  const month = monthRaw ? Number(monthRaw) : now.getMonth() + 1;
  const year = yearRaw ? Number(yearRaw) : now.getFullYear();

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    return { error: "El parámetro «month» debe ser un entero entre 1 y 12." } as const;
  }

  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    return { error: "El parámetro «year» debe ser un entero entre 2000 y 2100." } as const;
  }

  return { month, year } as const;
}

export async function GET(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const parsed = parseMonthYear(new URL(request.url).searchParams);
  if ("error" in parsed) {
    return Response.json({ ok: false, error: parsed.error }, { status: 400 });
  }

  const data = await getMonthlyStatsAdmin(parsed.month, parsed.year);

  return Response.json({ ok: true, data });
}
