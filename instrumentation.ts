export async function register() {
  if (process.env.VERCEL !== "1" && process.env.VERCEL_ENV !== "production") return;

  const { assertProductionEnv } = await import("@/lib/production-env");
  assertProductionEnv();
}
