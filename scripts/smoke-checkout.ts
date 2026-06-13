#!/usr/bin/env tsx
/**
 * Smoke test del flujo de compra vía API.
 * Uso: npm run smoke -- http://localhost:3000
 */
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");

type Json = { ok?: boolean; data?: Record<string, unknown>; error?: string };

async function request(method: string, path: string, body?: unknown): Promise<Json> {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  try {
    return JSON.parse(text) as Json;
  } catch {
    throw new Error(`${method} ${path} → ${response.status}: ${text.slice(0, 120)}`);
  }
}

function assert(label: string, ok: boolean, detail?: string) {
  console.log(`${ok ? "✅" : "❌"} ${label}${detail ? ` — ${detail}` : ""}`);
  if (!ok) process.exitCode = 1;
}

async function main() {
  console.log(`\nSmoke test → ${base}\n`);

  const health = await request("GET", "/api/health");
  assert("Health", health.ok === true, String(health.data?.fuenteDatos ?? ""));

  const productos = await request("GET", "/api/productos?pagina=1");
  const lista = productos.data?.productos as { id: number; slug: string; precio: number }[] | undefined;
  assert("Catálogo", Boolean(lista?.length), `${lista?.length ?? 0} productos`);

  const producto = lista?.[0];
  if (!producto) {
    console.log("\nNo hay productos para probar checkout.");
    process.exit(process.exitCode ?? 1);
  }

  const validar = await request("POST", "/api/carrito/validar", {
    items: [{ id: producto.id, cantidad: 1 }],
  });
  assert("Validar carrito", validar.data?.valido === true, `total ${validar.data?.total}`);

  const subtotal = Number(validar.data?.total ?? 0);
  const recargoAddi = Math.round(subtotal * 0.2);
  const totalAddi = subtotal + recargoAddi;

  const pedidoAddi = await request("POST", "/api/pedidos", {
    nombre: "Smoke Test",
    telefono: "3000000000",
    email: "smoke-invalid",
    ciudad: "Barranquilla",
    direccion: "Test",
    metodoPago: "addi",
    subtotal,
    recargoFinanciacion: recargoAddi,
    total: totalAddi,
    items: [{ id: producto.id, cantidad: 1 }],
  });
  assert("Rechaza email inválido", pedidoAddi.ok === false);

  const pedidoTamper = await request("POST", "/api/pedidos", {
    nombre: "Smoke Test",
    telefono: "3000000000",
    email: "qa@example.com",
    ciudad: "Barranquilla",
    direccion: "Test",
    metodoPago: "addi",
    subtotal,
    recargoFinanciacion: 0,
    total: subtotal,
    items: [{ id: producto.id, cantidad: 1 }],
  });
  assert("Rechaza total manipulado (Addi)", pedidoTamper.ok === false);

  const admin = await fetch(`${base}/api/admin/pedidos`);
  assert("Admin sin sesión → 401", admin.status === 401);

  const paginas = ["/", "/catalogo", "/categorias", "/metodos-pago", "/robots.txt", "/sitemap.xml"];
  for (const path of paginas) {
    const res = await fetch(`${base}${path}`);
    assert(`GET ${path}`, res.ok, String(res.status));
  }

  console.log("\nListo. Revisa ❌ arriba si los hay.\n");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
