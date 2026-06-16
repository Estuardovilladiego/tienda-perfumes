export async function register() {
  if (process.env.VERCEL_ENV !== "production") return;

  const { assertProductionEnv } = await import("@/lib/production-env");
  assertProductionEnv();
}
