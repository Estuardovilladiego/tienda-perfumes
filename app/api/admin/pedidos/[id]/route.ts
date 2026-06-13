import { requireAdminApi } from "@/lib/admin-auth";
import { cambiarEstadoPedidoAdmin, eliminarPedidoAdmin } from "@/lib/admin-data";
import { estadosPedido, type EstadoPedidoInput } from "@/lib/admin-validation";

type Params = { params: Promise<{ id: string }> };

function parseId(id: string) {
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function PATCH(request: Request, { params }: Params) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const id = parseId((await params).id);
  if (!id) return Response.json({ ok: false, error: "ID invalido" }, { status: 400 });

  const body = (await request.json().catch(() => null)) as { estado?: EstadoPedidoInput } | null;
  if (!body?.estado || !estadosPedido.includes(body.estado)) {
    return Response.json({ ok: false, error: "Estado invalido" }, { status: 400 });
  }

  return Response.json({ ok: true, data: await cambiarEstadoPedidoAdmin(id, body.estado) });
}

export async function DELETE(_request: Request, { params }: Params) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const id = parseId((await params).id);
  if (!id) return Response.json({ ok: false, error: "ID invalido" }, { status: 400 });

  try {
    await eliminarPedidoAdmin(id);
    return Response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo eliminar el pedido";
    const status = message.includes("no encontrado")
      ? 404
      : message.includes("entregado")
        ? 409
        : 400;
    return Response.json({ ok: false, error: message }, { status });
  }
}
