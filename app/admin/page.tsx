import AdminPanel from "@/app/components/admin/AdminPanel";
import { getDashboardAdmin, listarCategoriasAdmin, listarInventarioAdmin, listarPedidosAdmin, listarProductosAdmin } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";

export const metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();

  const [dashboard, productos, categorias, inventario, pedidos] = await Promise.all([
    getDashboardAdmin(),
    listarProductosAdmin(),
    listarCategoriasAdmin(),
    listarInventarioAdmin(),
    listarPedidosAdmin(),
  ]);

  return (
    <AdminPanel
      initialDashboard={dashboard}
      initialProductos={productos}
      initialCategorias={categorias}
      initialInventario={inventario}
      initialPedidos={pedidos}
    />
  );
}
