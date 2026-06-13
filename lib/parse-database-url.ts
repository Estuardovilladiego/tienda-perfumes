/** Parsea DATABASE_URL (mysql://…) para el adaptador MariaDB de Prisma 7. */
export function parseDatabaseUrl(url: string) {
  const parsed = new URL(url);
  const database = parsed.pathname.replace(/^\//, "").split("?")[0];

  if (!database) {
    throw new Error("DATABASE_URL debe incluir el nombre de la base de datos");
  }

  const hostname = parsed.hostname || "localhost";
  // En Windows, "localhost" suele resolver a ::1 y MySQL/XAMPP escucha en 127.0.0.1
  const host = hostname === "localhost" ? "127.0.0.1" : hostname;

  return {
    host,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database,
  };
}
