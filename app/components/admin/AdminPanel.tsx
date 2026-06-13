"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Boxes,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  ExternalLink,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  PanelLeft,
  PanelLeftClose,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, Fragment, useMemo, useState } from "react";

import AdminImageField, { AdminImageGalleryField } from "@/app/components/admin/AdminImageField";
import AdminProductModal from "@/app/components/admin/AdminProductModal";
import {
  AdminFieldInput,
  AdminFieldTextarea,
  AdminFormGroup,
  AdminProductCard,
} from "@/app/components/admin/AdminPrimitives";
import AdminBackLink from "@/app/components/navigation/AdminBackLink";
import {
  AdminPageLayout,
  AdminPagination,
  AdminSectionHeader,
  AdminSidebar,
  AdminTableWrap,
  InventoryAdjustForm,
  InventoryHistoryItem,
  StockBadge,
} from "@/app/components/admin/AdminUi";
import { slugify } from "@/lib/admin-validation";
import { formatDateTime as formatDate } from "@/lib/format-date";

const SIDEBAR_STORAGE_KEY = "essenza-admin-sidebar";
const PEDIDOS_POR_PAGINA = 5;

type Tab = "dashboard" | "productos" | "categorias" | "inventario" | "pedidos";
type ApiResult<T> = { ok: boolean; data?: T; error?: string; errors?: string[] };

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "productos", label: "Productos", icon: Package },
  { id: "categorias", label: "Categorías", icon: FolderTree },
  { id: "inventario", label: "Inventario", icon: Boxes },
  { id: "pedidos", label: "Pedidos", icon: ClipboardList },
];

const estados = ["pendiente", "confirmado", "preparando", "enviado", "entregado", "cancelado"];

const productFlags = [
  { key: "destacado", label: "Destacado" },
  { key: "esNuevo", label: "Nuevo" },
  { key: "enOferta", label: "En oferta" },
  { key: "activo", label: "Activo" },
] as const;

const emptyProduct = {
  nombre: "",
  marca: "",
  descripcion: "",
  precio: 0,
  precioAnterior: "",
  sku: "",
  volumen: "100 ML",
  stock: 1,
  imagen: "",
  imagenes: "",
  destacado: false,
  esNuevo: false,
  enOferta: false,
  activo: true,
  familiaOlfativa: "",
  notasSalida: "",
  notasCorazon: "",
  notasFondo: "",
  categorias: [] as number[],
};

const emptyCategory = { nombre: "", slug: "", imagen: "", orden: 0 };

type ProductoFiltro = "todos" | "activos" | "inactivos" | "agotados" | "poco-stock" | "oferta" | "destacado" | "nuevo";

function money(value: number) {
  return `$${Number(value || 0).toLocaleString("es-CO")}`;
}

function buildProductoPayload(form: any) {
  return {
    nombre: form.nombre,
    marca: form.marca,
    descripcion: form.descripcion,
    precio: Number(form.precio),
    precioAnterior:
      form.precioAnterior === "" || form.precioAnterior == null
        ? null
        : Number(form.precioAnterior),
    sku: String(form.sku ?? "").trim() || null,
    volumen: form.volumen,
    stock: Number(form.stock),
    imagen: form.imagen,
    imagenes: String(form.imagenes || "")
      .split("\n")
      .map((i: string) => i.trim())
      .filter(Boolean),
    destacado: Boolean(form.destacado),
    esNuevo: Boolean(form.esNuevo),
    enOferta: Boolean(form.enOferta),
    activo: form.activo !== false,
    familiaOlfativa: form.familiaOlfativa || "",
    notasSalida: form.notasSalida || "",
    notasCorazon: form.notasCorazon || "",
    notasFondo: form.notasFondo || "",
    categorias: Array.isArray(form.categorias) ? form.categorias : [],
  };
}

function productAdminToForm(p: any) {
  return {
    nombre: p.nombre,
    marca: p.marca || "",
    descripcion: p.descripcion,
    precio: p.precio,
    precioAnterior: p.precioAnterior ?? "",
    sku: p.sku || "",
    volumen: p.volumen,
    stock: p.stock,
    imagen: p.imagen,
    imagenes: (p.imagenes || []).join("\n"),
    destacado: Boolean(p.destacado),
    esNuevo: Boolean(p.esNuevo),
    enOferta: Boolean(p.enOferta),
    activo: p.activo !== false,
    familiaOlfativa: p.familiaOlfativa || "",
    notasSalida: p.notasSalida || "",
    notasCorazon: p.notasCorazon || "",
    notasFondo: p.notasFondo || "",
    categorias: (p.categorias || []).map((c: any) => c.id),
  };
}

async function api<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    cache: "no-store",
    credentials: "same-origin",
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const json = (await response.json().catch(() => ({ ok: false, error: "Respuesta inválida" }))) as ApiResult<T>;
  if (!response.ok || !json.ok) {
    throw new Error(json.errors?.join(". ") || json.error || "Error inesperado");
  }
  return json.data as T;
}

const TAB_API: Record<Tab, string> = {
  dashboard: "/api/admin/dashboard",
  productos: "/api/admin/productos",
  categorias: "/api/admin/categorias",
  inventario: "/api/admin/inventario",
  pedidos: "/api/admin/pedidos",
};

function Alert({ type, children }: { type: "error" | "success"; children: string }) {
  if (!children) return null;
  return (
    <div className={type === "error" ? "admin-alert-error" : "admin-alert-success"} role={type === "error" ? "alert" : "status"}>
      {children}
    </div>
  );
}

export default function AdminPanel({
  initialDashboard,
  initialProductos,
  initialCategorias,
  initialInventario,
  initialPedidos,
}: any) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [productos, setProductos] = useState(initialProductos);
  const [categorias, setCategorias] = useState(initialCategorias);
  const [inventario, setInventario] = useState(initialInventario);
  const [pedidos, setPedidos] = useState(initialPedidos);
  const [productoForm, setProductoForm] = useState<any>(emptyProduct);
  const [productoEditId, setProductoEditId] = useState<number | null>(null);
  const [productoModalOpen, setProductoModalOpen] = useState(false);
  const [categoriaForm, setCategoriaForm] = useState<any>(emptyCategory);
  const [categoriaEditId, setCategoriaEditId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      return localStorage.getItem(SIDEBAR_STORAGE_KEY) !== "closed";
    } catch {
      return true;
    }
  });

  function toggleSidebar() {
    setSidebarOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? "open" : "closed");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  const lowStock = useMemo(
    () => productos.filter((p: any) => p.activo && p.stock > 0 && p.stock < 5),
    [productos]
  );
  const outStock = useMemo(
    () => productos.filter((p: any) => p.activo && p.stock === 0),
    [productos]
  );

  function clearFeedback() {
    setError("");
    setMessage("");
  }

  function closeProductModal() {
    setProductoModalOpen(false);
    setProductoEditId(null);
    setProductoForm(emptyProduct);
  }

  function openCreateProductModal() {
    setProductoEditId(null);
    setProductoForm(emptyProduct);
    setProductoModalOpen(true);
    clearFeedback();
  }

  function openEditProductModal(p: any) {
    setProductoEditId(p.id);
    setProductoForm(productAdminToForm(p));
    setProductoModalOpen(true);
    clearFeedback();
  }

  function switchTab(next: Tab) {
    clearFeedback();
    if (next !== "productos") closeProductModal();
    setTab(next);
  }

  async function reloadPanels(targets: Tab[]) {
    const unique = [...new Set(targets)];
    const pairs = await Promise.all(
      unique.map(async (target) => [target, await api(TAB_API[target])] as const)
    );

    for (const [target, data] of pairs) {
      if (target === "dashboard") setDashboard(data);
      if (target === "productos") setProductos(data);
      if (target === "categorias") setCategorias(data);
      if (target === "inventario") setInventario(data);
      if (target === "pedidos") setPedidos(data);
    }
  }

  async function refresh(target: Tab = tab) {
    setLoading(true);
    setError("");
    try {
      await reloadPanels([target]);
      setMessage("Datos actualizados");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo actualizar");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  async function saveProduct(event: FormEvent) {
    event.preventDefault();
    const formEl = event.currentTarget as HTMLFormElement;
    if (!formEl.checkValidity()) {
      formEl.reportValidity();
      return;
    }

    setLoading(true);
    clearFeedback();
    const editingId = productoEditId;
    try {
      const payload = buildProductoPayload(productoForm);
      if (!payload.categorias.length) {
        setError("Selecciona al menos una categoría");
        return;
      }
      if (!Number.isFinite(payload.precio) || payload.precio <= 0) {
        setError("El precio debe ser mayor a 0");
        return;
      }
      if (!payload.imagen?.trim()) {
        setError("La imagen principal es obligatoria");
        return;
      }

      const saved = await api<any>(
        editingId ? `/api/admin/productos/${editingId}` : "/api/admin/productos",
        {
          method: editingId ? "PUT" : "POST",
          body: JSON.stringify(payload),
        }
      );

      if (editingId) {
        setProductos((prev: any[]) => prev.map((p: any) => (p.id === saved.id ? saved : p)));
        setMessage("Producto actualizado correctamente");
        closeProductModal();
      } else {
        setProductos((prev: any[]) => [saved, ...prev]);
        setMessage("Producto creado correctamente");
        closeProductModal();
      }

      try {
        await reloadPanels(["productos", "dashboard"]);
      } catch {
        /* El guardado ya se aplicó; la lista local ya está actualizada. */
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar el producto");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id: number) {
    if (!confirm("¿Desactivar este producto del catálogo?")) return;
    setLoading(true);
    clearFeedback();
    try {
      await api(`/api/admin/productos/${id}`, { method: "DELETE" });
      setMessage("Producto desactivado");
      if (productoEditId === id) closeProductModal();
      await reloadPanels(["productos", "dashboard"]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo eliminar el producto");
    } finally {
      setLoading(false);
    }
  }

  async function saveCategory(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    clearFeedback();
    const editingId = categoriaEditId;
    try {
      const saved = await api<any>(
        editingId ? `/api/admin/categorias/${editingId}` : "/api/admin/categorias",
        {
          method: editingId ? "PUT" : "POST",
          body: JSON.stringify({
            ...categoriaForm,
            slug: categoriaForm.slug || slugify(categoriaForm.nombre),
            orden: Number(categoriaForm.orden || 0),
          }),
        }
      );

      if (editingId) {
        setCategoriaEditId(saved.id);
        setCategoriaForm({
          nombre: saved.nombre,
          slug: saved.slug,
          imagen: saved.imagen || "",
          orden: saved.orden,
        });
        setCategorias((prev: any[]) => prev.map((c: any) => (c.id === saved.id ? saved : c)));
        setMessage("Categoría actualizada correctamente");
      } else {
        setCategoriaEditId(null);
        setCategoriaForm(emptyCategory);
        setCategorias((prev: any[]) => [...prev, saved]);
        setMessage("Categoría creada correctamente");
      }

      try {
        await reloadPanels(["categorias"]);
      } catch {
        /* El guardado ya se aplicó; la lista local ya está actualizada. */
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar la categoría");
    } finally {
      setLoading(false);
    }
  }

  async function deleteCategory(id: number) {
    if (!confirm("¿Eliminar esta categoría? Solo funciona si no tiene productos asociados.")) return;
    setLoading(true);
    clearFeedback();
    try {
      await api(`/api/admin/categorias/${id}`, { method: "DELETE" });
      setMessage("Categoría eliminada");
      if (categoriaEditId === id) {
        setCategoriaEditId(null);
        setCategoriaForm(emptyCategory);
      }
      await reloadPanels(["categorias"]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo eliminar la categoría");
    } finally {
      setLoading(false);
    }
  }

  async function moveStock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const data = new FormData(formEl);
    const productoId = Number(data.get("productoId"));
    const modo = String(data.get("modo") || "");
    const cantidad = Number(data.get("cantidad"));
    const motivo = String(data.get("motivo") || "");

    if (!productoId || !["ajustar", "incrementar", "reducir"].includes(modo)) {
      setError("Selecciona una acción válida");
      return;
    }
    if (!Number.isFinite(cantidad) || cantidad < 0) {
      setError("Ingresa una cantidad válida");
      return;
    }

    setLoading(true);
    clearFeedback();
    try {
      await api("/api/admin/inventario", {
        method: "POST",
        body: JSON.stringify({ productoId, modo, cantidad, motivo }),
      });
      if (formEl.isConnected) {
        formEl.reset();
      }
      setMessage("Inventario actualizado");
      await reloadPanels(["inventario", "productos", "dashboard"]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo ajustar inventario");
    } finally {
      setLoading(false);
    }
  }

  async function changeOrder(id: number, estado: string) {
    clearFeedback();
    try {
      await api(`/api/admin/pedidos/${id}`, { method: "PATCH", body: JSON.stringify({ estado }) });
      setMessage("Estado del pedido actualizado");
      await reloadPanels(["pedidos"]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cambiar el estado");
    }
  }

  async function deleteOrder(id: number, numero?: string) {
    if (!confirm(`¿Eliminar el pedido ${numero || `#${id}`}? Esta acción no se puede deshacer.`)) return;
    setLoading(true);
    clearFeedback();
    try {
      await api(`/api/admin/pedidos/${id}`, { method: "DELETE" });
      setMessage("Pedido eliminado");
      await reloadPanels(["pedidos", "dashboard"]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo eliminar el pedido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="admin-header-bar">
        <div className="admin-header-inner">
          <div className="admin-header-brand">
            <button
              type="button"
              onClick={toggleSidebar}
              className="admin-btn admin-btn-soft admin-btn-menu shrink-0"
              aria-expanded={sidebarOpen}
              aria-controls="admin-sidebar"
              aria-label={sidebarOpen ? "Ocultar menú de navegación" : "Mostrar menú de navegación"}
            >
              {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
              <span className="hidden sm:inline">{sidebarOpen ? "Ocultar" : "Menú"}</span>
            </button>
            <div className="admin-header-logo" aria-hidden>
              E
            </div>
            <div className="min-w-0">
              <p className="admin-header-eyebrow">Essenza Admin</p>
              <h1 className="admin-header-title">Gestión comercial</h1>
            </div>
          </div>
          <div className="admin-header-actions">
            <Link href="/" className="admin-btn admin-btn-soft" target="_blank" rel="noopener noreferrer">
              <ExternalLink size={16} /> Ver tienda
            </Link>
            <button type="button" onClick={() => refresh()} className="admin-btn admin-btn-soft" disabled={loading}>
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Actualizar
            </button>
            <button type="button" onClick={logout} className="admin-btn">
              <LogOut size={16} /> Salir
            </button>
          </div>
        </div>
      </header>

      <AdminPageLayout sidebarOpen={sidebarOpen} sidebar={
          <AdminSidebar
            id="admin-sidebar"
            tabs={tabs}
            active={tab}
            onChange={(id) => switchTab(id as Tab)}
          />
        }
      >
          {tab !== "dashboard" ? (
            <AdminBackLink
              label="Dashboard"
              onClick={() => switchTab("dashboard")}
              className="admin-back-link-standalone"
            />
          ) : null}

          <Alert type="error">{error}</Alert>
          <Alert type="success">{message}</Alert>

          {tab === "dashboard" && (
            <div className="admin-form-stack">
              <div className="admin-stat-grid">
                {[
                  ["Productos activos", dashboard.totalProductos],
                  ["Categorías", dashboard.totalCategorias],
                  ["Pedidos", dashboard.totalPedidos],
                  ["Poco stock", dashboard.pocoStock],
                  ["Agotados", dashboard.agotados],
                ].map(([label, value]) => (
                  <div key={label} className="admin-stat-card">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted">{label}</p>
                    <p>{String(value)}</p>
                  </div>
                ))}
              </div>
              <StockAlerts lowStock={lowStock} outStock={outStock} />
              <RecentOrders pedidos={dashboard.ultimosPedidos || []} />
            </div>
          )}

          {tab === "productos" && (
            <>
              <ProductTable
                productos={productos}
                categorias={categorias}
                onEdit={openEditProductModal}
                onCreate={openCreateProductModal}
                onDelete={deleteProduct}
              />
              <AdminProductModal
                open={productoModalOpen}
                onClose={closeProductModal}
                title={productoEditId ? productoForm.nombre || "Editar producto" : "Nuevo producto"}
                subtitle={
                  productoEditId
                    ? [productoForm.marca, productoForm.volumen].filter(Boolean).join(" · ")
                    : "Completa la ficha del perfume para el catálogo"
                }
              >
                <ProductForm
                  form={productoForm}
                  setForm={setProductoForm}
                  editId={productoEditId}
                  categorias={categorias}
                  onSubmit={saveProduct}
                  onCancel={closeProductModal}
                  loading={loading}
                  error={error}
                  message={message}
                  inModal
                />
              </AdminProductModal>
            </>
          )}

          {tab === "categorias" && (
            <div className="admin-split-layout admin-split-layout-form">
              {categoriaEditId ? (
                <AdminBackLink
                  label="Volver al listado de categorías"
                  onClick={() => {
                    setCategoriaEditId(null);
                    setCategoriaForm(emptyCategory);
                    clearFeedback();
                  }}
                  className="admin-back-link-standalone"
                />
              ) : null}
              <CategoryForm
                form={categoriaForm}
                setForm={setCategoriaForm}
                editId={categoriaEditId}
                onSubmit={saveCategory}
                onCancel={() => {
                  setCategoriaEditId(null);
                  setCategoriaForm(emptyCategory);
                }}
                loading={loading}
              />
              <CategoryTable
                categorias={categorias}
                onEdit={(c: any) => {
                  setCategoriaEditId(c.id);
                  setCategoriaForm({
                    nombre: c.nombre,
                    slug: c.slug,
                    imagen: c.imagen || "",
                    orden: c.orden,
                  });
                  clearFeedback();
                }}
                onDelete={deleteCategory}
              />
            </div>
          )}

          {tab === "inventario" && (
            <InventoryPanel
              inventario={inventario}
              moveStock={moveStock}
              loading={loading}
              sidebarOpen={sidebarOpen}
            />
          )}
          {tab === "pedidos" && (
            <OrdersPanel pedidos={pedidos} changeOrder={changeOrder} onDelete={deleteOrder} />
          )}
      </AdminPageLayout>
    </>
  );
}

function StockAlerts({ lowStock, outStock }: any) {
  return (
    <div className="admin-split-layout admin-split-layout-duo">
      <div className="admin-card">
        <AdminSectionHeader title="Menos de 5 unidades" subtitle="Productos activos con stock bajo" />
        <AdminList items={lowStock} empty="Sin alertas de poco stock" badgeClass="admin-badge-amber" />
      </div>
      <div className="admin-card">
        <AdminSectionHeader title="Agotados" subtitle="Productos activos sin unidades" />
        <AdminList items={outStock} empty="Sin productos agotados" badgeClass="admin-badge-red" />
      </div>
    </div>
  );
}

function RecentOrders({ pedidos }: any) {
  if (!pedidos.length) {
    return (
      <div className="admin-card">
        <AdminSectionHeader title="Últimos pedidos" subtitle="Actividad reciente en la tienda" />
        <p className="admin-empty-state">Aún no hay pedidos registrados.</p>
      </div>
    );
  }

  return (
    <div className="admin-card admin-card-flush">
      <AdminSectionHeader title="Últimos pedidos" subtitle="Actividad reciente en la tienda" />
      <AdminTableWrap minWidth={560}>
        <table className="admin-table admin-table-orders">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p: any) => (
              <tr key={p.id}>
                <td>{p.numero || `#${p.id}`}</td>
                <td>
                  {p.nombre}
                  <div className="text-xs text-muted">{p.telefono}</div>
                </td>
                <td>{money(p.total)}</td>
                <td>
                  <span className="admin-badge admin-badge-green">{p.estado}</span>
                </td>
                <td className="text-muted">{formatDate(p.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableWrap>
    </div>
  );
}

function AdminList({ items, empty, badgeClass }: any) {
  if (!items.length) return <p className="admin-empty-state">{empty}</p>;
  return (
    <ul className="admin-list-stack">
      {items.map((p: any) => (
        <li key={p.id} className="admin-list-item">
          <span>{p.nombre}</span>
          <span className={`admin-badge ${badgeClass}`}>{p.stock}</span>
        </li>
      ))}
    </ul>
  );
}

function ProductForm({ form, setForm, editId, categorias, onSubmit, onCancel, loading, error, message, inModal = false }: any) {
  function set(key: string, value: any) {
    setForm((f: any) => ({ ...f, [key]: value }));
  }

  function toggleCategory(id: number) {
    setForm((f: any) => ({
      ...f,
      categorias: f.categorias.includes(id)
        ? f.categorias.filter((c: number) => c !== id)
        : [...f.categorias, id],
    }));
  }

  const fields = (
    <>
      <AdminFormGroup title="Identidad" description="Nombre, marca e identificadores del perfume.">
        <AdminFieldInput label="Nombre" value={form.nombre} onChange={(e) => set("nombre", e.target.value)} required />
        <AdminFieldInput label="Marca" value={form.marca} onChange={(e) => set("marca", e.target.value)} required />
        <AdminFieldInput
          label="SKU"
          value={form.sku || ""}
          onChange={(e) => set("sku", e.target.value)}
          hint="Código único por producto. Déjalo vacío si no usas SKU."
          className={error?.includes("SKU") ? "admin-field-error" : ""}
        />
        <AdminFieldInput label="Volumen" value={form.volumen} onChange={(e) => set("volumen", e.target.value)} required />
      </AdminFormGroup>

      <AdminFormGroup title="Precio e inventario" description="Valores comerciales y unidades disponibles.">
        <AdminFieldInput
          label="Precio"
          type="number"
          value={form.precio}
          onChange={(e) => set("precio", e.target.value)}
          required
        />
        <AdminFieldInput
          label="Precio anterior"
          type="number"
          value={form.precioAnterior}
          onChange={(e) => set("precioAnterior", e.target.value)}
        />
        <AdminFieldInput
          label="Stock"
          type="number"
          value={form.stock}
          onChange={(e) => set("stock", e.target.value)}
          required
        />
      </AdminFormGroup>

      <AdminFormGroup title="Notas olfativas" description="Composición aromática del fragrance.">
        <AdminFieldInput
          label="Familia olfativa"
          value={form.familiaOlfativa || ""}
          onChange={(e) => set("familiaOlfativa", e.target.value)}
        />
        <AdminFieldInput
          label="Notas de salida"
          value={form.notasSalida || ""}
          onChange={(e) => set("notasSalida", e.target.value)}
        />
        <AdminFieldInput
          label="Notas de corazón"
          value={form.notasCorazon || ""}
          onChange={(e) => set("notasCorazon", e.target.value)}
        />
        <AdminFieldInput
          label="Notas de fondo"
          value={form.notasFondo || ""}
          onChange={(e) => set("notasFondo", e.target.value)}
        />
      </AdminFormGroup>

      <AdminFormGroup title="Imagen y descripción" description="Presentación visual y copy del producto." columns={1}>
        <AdminImageField
          label="Imagen principal"
          value={form.imagen}
          onChange={(url) => set("imagen", url)}
          folder="productos"
          required
        />
        <AdminFieldTextarea
          label="Descripción"
          value={form.descripcion}
          onChange={(e) => set("descripcion", e.target.value)}
          required
          rows={4}
        />
        <AdminImageGalleryField
          label="Imágenes secundarias"
          value={form.imagenes}
          onChange={(v) => set("imagenes", v)}
          folder="productos"
        />
      </AdminFormGroup>

      <AdminFormGroup title="Clasificación" description="Categorías y etiquetas del catálogo." columns={1}>
        <div>
          <p className="admin-label">Categorías</p>
          {categorias.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {categorias.map((c: any) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => toggleCategory(c.id)}
                  className={`admin-chip ${form.categorias.includes(c.id) ? "admin-chip-active" : ""}`}
                >
                  {c.nombre}
                </button>
              ))}
            </div>
          ) : (
            <p className="admin-field-hint">Crea categorías antes de asignar productos.</p>
          )}
          {!form.categorias.length ? (
            <p className="admin-alert-error mt-3 text-sm" role="alert">
              Selecciona al menos una categoría para poder guardar.
            </p>
          ) : null}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {productFlags.map(({ key, label }) => (
            <label key={key} className="admin-check">
              <input type="checkbox" checked={Boolean(form[key])} onChange={(e) => set(key, e.target.checked)} />
              {label}
            </label>
          ))}
        </div>
      </AdminFormGroup>
    </>
  );

  const footer = (
    <>
      <Alert type="error">{error}</Alert>
      <Alert type="success">{message}</Alert>
      <button type="submit" className="admin-primary admin-btn-premium admin-primary-lg" disabled={loading}>
        <Save size={16} /> {editId ? "Guardar cambios" : "Guardar producto"}
      </button>
      <button type="button" onClick={onCancel} className="admin-btn admin-btn-ghost">
        Cancelar
      </button>
    </>
  );

  if (inModal) {
    return (
      <form onSubmit={onSubmit} className="admin-modal-form">
        <div className="admin-modal-body">
          <div className="admin-form-stack admin-form-modal">{fields}</div>
        </div>
        <div className="admin-modal-footer">{footer}</div>
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className="admin-card admin-form-stack">
      <AdminSectionHeader
        title={editId ? "Editar producto" : "Crear producto"}
        subtitle="Información del catálogo y stock inicial"
      />
      {fields}
      <div className="admin-form-footer admin-form-actions">{footer}</div>
    </form>
  );
}

function ProductTable({ productos, categorias, onEdit, onCreate, onDelete }: any) {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaId, setCategoriaId] = useState<string>("todos");
  const [filtro, setFiltro] = useState<ProductoFiltro>("todos");

  const filtrados = useMemo(() => {
    let list = productos as any[];
    const q = busqueda.trim().toLowerCase();

    if (q) {
      list = list.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          String(p.marca || "")
            .toLowerCase()
            .includes(q) ||
          String(p.sku || "")
            .toLowerCase()
            .includes(q)
      );
    }

    if (categoriaId !== "todos") {
      const id = Number(categoriaId);
      list = list.filter((p) => p.categorias.some((c: any) => c.id === id));
    }

    switch (filtro) {
      case "activos":
        list = list.filter((p) => p.activo);
        break;
      case "inactivos":
        list = list.filter((p) => !p.activo);
        break;
      case "agotados":
        list = list.filter((p) => p.activo && p.stock === 0);
        break;
      case "poco-stock":
        list = list.filter((p) => p.activo && p.stock > 0 && p.stock < 5);
        break;
      case "oferta":
        list = list.filter((p) => p.enOferta);
        break;
      case "destacado":
        list = list.filter((p) => p.destacado);
        break;
      case "nuevo":
        list = list.filter((p) => p.esNuevo);
        break;
    }

    return list;
  }, [productos, busqueda, categoriaId, filtro]);

  const hayFiltros = busqueda.trim() || categoriaId !== "todos" || filtro !== "todos";

  function limpiarFiltros() {
    setBusqueda("");
    setCategoriaId("todos");
    setFiltro("todos");
  }

  if (!productos.length) {
    return (
      <div className="admin-card">
        <AdminSectionHeader
          title="Productos"
          action={
            <button type="button" onClick={onCreate} className="admin-primary admin-btn-premium admin-small">
              <Plus size={14} /> Nuevo producto
            </button>
          }
        />
        <p className="admin-empty-state">No hay productos registrados.</p>
      </div>
    );
  }

  return (
    <div className="admin-card admin-card-flush">
      <div className="admin-card-body">
        <AdminSectionHeader
          title={`Productos (${filtrados.length}${hayFiltros ? ` de ${productos.length}` : ""})`}
          subtitle="Filtra y gestiona el catálogo"
          action={
            <div className="flex flex-wrap items-center gap-2">
              {hayFiltros ? (
                <button type="button" onClick={limpiarFiltros} className="admin-small">
                  <X size={14} /> Limpiar filtros
                </button>
              ) : null}
              <button type="button" onClick={onCreate} className="admin-primary admin-btn-premium admin-small">
                <Plus size={14} /> Nuevo producto
              </button>
            </div>
          }
        />

        <div className="admin-toolbar">
          <label className="admin-toolbar-search">
            <span className="sr-only">Buscar productos</span>
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar nombre, marca o SKU…"
              className="admin-input"
            />
          </label>
          <div className="admin-toolbar-filters">
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="admin-input admin-select"
              aria-label="Filtrar por categoría"
            >
              <option value="todos">Todas las categorías</option>
              {categorias.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value as ProductoFiltro)}
              className="admin-input admin-select"
              aria-label="Filtrar productos"
            >
              <option value="todos">Todos</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
              <option value="agotados">Agotados</option>
              <option value="poco-stock">Poco stock</option>
              <option value="oferta">En oferta</option>
              <option value="destacado">Destacados</option>
              <option value="nuevo">Nuevos</option>
            </select>
          </div>
        </div>

        {!filtrados.length ? (
          <p className="admin-empty-state">Ningún producto coincide con los filtros.</p>
        ) : null}
      </div>

      {filtrados.length ? (
        <>
          <div className="admin-hidden-mobile admin-product-cards">
            {filtrados.map((p: any) => (
              <AdminProductCard
                key={p.id}
                producto={p}
                onEdit={() => onEdit(p)}
                onDelete={() => onDelete(p.id)}
              />
            ))}
          </div>
          <div className="admin-hidden-lg">
            <AdminTableWrap minWidth={680}>
              <table className="admin-table admin-table-products admin-table-sticky">
                <colgroup>
                  <col className="admin-col-name" />
                  <col className="admin-col-cat" />
                  <col className="admin-col-price" />
                  <col className="admin-col-stock" />
                  <col className="admin-col-actions" />
                </colgroup>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Categorías</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th aria-label="Acciones" />
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((p: any) => (
                    <tr key={p.id} className={!p.activo ? "opacity-50" : ""}>
                      <td>
                        <div className="flex items-center gap-3">
                          {p.imagen ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.imagen}
                              alt=""
                              className="admin-product-card-thumb"
                            />
                          ) : null}
                          <div className="min-w-0">
                            <div className="truncate font-medium">{p.nombre}</div>
                            <div className="truncate text-xs text-muted">
                              {p.marca} · {p.sku || "Sin SKU"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-sm">{p.categorias.map((c: any) => c.nombre).join(", ") || "—"}</td>
                      <td className="font-medium">{money(p.precio)}</td>
                      <td>
                        <StockBadge stock={p.stock} />
                      </td>
                      <td className="admin-cell-actions">
                        <button type="button" onClick={() => onEdit(p)} className="admin-small">
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(p.id)}
                          className="admin-danger"
                          aria-label="Desactivar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AdminTableWrap>
          </div>
        </>
      ) : null}
    </div>
  );
}

function CategoryForm({ form, setForm, editId, onSubmit, onCancel, loading }: any) {
  const set = (key: string, value: any) => setForm((f: any) => ({ ...f, [key]: value }));

  function onNombreChange(value: string) {
    setForm((f: any) => ({
      ...f,
      nombre: value,
      slug: editId ? f.slug : slugify(value),
    }));
  }

  return (
    <form onSubmit={onSubmit} className="admin-card admin-form-stack">
      <AdminSectionHeader
        title={editId ? "Editar categoría" : "Crear categoría"}
        subtitle="Organiza el catálogo por familias"
      />
      <AdminFieldInput
        label="Nombre"
        value={form.nombre}
        onChange={(e) => onNombreChange(e.target.value)}
        required
      />
      <AdminFieldInput label="Slug" value={form.slug} onChange={(e) => set("slug", e.target.value)} required />
      <AdminImageField
        label="Imagen de categoría"
        value={form.imagen}
        onChange={(url) => set("imagen", url)}
        folder="categorias"
      />
      <AdminFieldInput label="Orden" type="number" value={form.orden} onChange={(e) => set("orden", e.target.value)} />
      <div className="admin-form-actions">
        <button type="submit" className="admin-primary" disabled={loading}>
          <Plus size={16} /> {editId ? "Guardar cambios" : "Crear categoría"}
        </button>
        {editId ? (
          <button type="button" onClick={onCancel} className="admin-btn">
            Cancelar
          </button>
        ) : null}
      </div>
    </form>
  );
}

function CategoryTable({ categorias, onEdit, onDelete }: any) {
  if (!categorias.length) {
    return (
      <div className="admin-card">
        <AdminSectionHeader title="Categorías" />
        <p className="admin-empty-state">No hay categorías registradas.</p>
      </div>
    );
  }

  return (
    <div className="admin-card admin-card-flush">
      <AdminSectionHeader title="Categorías" subtitle={`${categorias.length} registradas`} />
      <AdminTableWrap minWidth={520}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: "34%" }}>Categoría</th>
              <th style={{ width: "34%" }}>Slug</th>
              <th style={{ width: "14%" }}>Productos</th>
              <th style={{ width: "18%" }} aria-label="Acciones" />
            </tr>
          </thead>
          <tbody>
            {categorias.map((c: any) => (
              <tr key={c.id}>
                <td className="font-medium">{c.nombre}</td>
                <td className="text-muted">{c.slug}</td>
                <td>{c.productos?.length || 0}</td>
                <td className="admin-cell-actions">
                  <button type="button" onClick={() => onEdit(c)} className="admin-small">
                    Editar
                  </button>
                  <button type="button" onClick={() => onDelete(c.id)} className="admin-danger" aria-label="Eliminar">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableWrap>
    </div>
  );
}

function InventoryPanel({
  inventario,
  moveStock,
  loading,
  sidebarOpen,
}: {
  inventario: any;
  moveStock: (event: FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  sidebarOpen: boolean;
}) {
  return (
    <div
      className={`admin-inventory-layout ${sidebarOpen ? "" : "admin-inventory-layout-wide"}`}
    >
      <div className="admin-card admin-card-flush">
        <AdminSectionHeader
          title="Stock actual"
          subtitle="Ajusta unidades por producto sin salir de la tabla"
        />

        {!inventario.productos.length ? (
          <p className="admin-empty-state admin-card-body-tight">No hay productos activos.</p>
        ) : (
          <>
            <div className="admin-hidden-mobile">
              <AdminTableWrap fit>
                <table className="admin-table admin-table-inventory">
                  <colgroup>
                    <col className="admin-col-product" />
                    <col className="admin-col-stock" />
                    <col className="admin-col-adjust" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Stock</th>
                      <th>Ajuste de inventario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventario.productos.map((p: any) => (
                      <tr key={p.id}>
                        <td>
                          <div className="font-medium leading-snug">{p.nombre}</div>
                          {p.marca?.nombre ? (
                            <div className="mt-0.5 text-xs text-muted">{p.marca.nombre}</div>
                          ) : null}
                        </td>
                        <td>
                          <StockBadge stock={p.stock} />
                        </td>
                        <td>
                          <InventoryAdjustForm
                            productoId={p.id}
                            loading={loading}
                            onSubmit={moveStock}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </AdminTableWrap>
            </div>

            <div className="admin-hidden-lg admin-inventory-mobile-list">
              {inventario.productos.map((p: any) => (
                <article key={p.id} className="admin-inventory-mobile-card">
                  <div className="admin-inventory-mobile-head">
                    <div className="min-w-0">
                      <p className="admin-inventory-mobile-name">{p.nombre}</p>
                      {p.marca?.nombre ? (
                        <p className="admin-inventory-mobile-brand">{p.marca.nombre}</p>
                      ) : null}
                    </div>
                    <StockBadge stock={p.stock} />
                  </div>
                  <InventoryAdjustForm
                    productoId={p.id}
                    loading={loading}
                    onSubmit={moveStock}
                    layout="stacked"
                  />
                </article>
              ))}
            </div>
          </>
        )}
      </div>

      <aside className="admin-card admin-history-panel">
        <AdminSectionHeader title="Historial" subtitle="Movimientos recientes" />
        {!inventario.movimientos.length ? (
          <p className="admin-empty-state">Sin movimientos registrados.</p>
        ) : (
          <div className="admin-history-scroll">
            {inventario.movimientos.map((m: any) => (
              <InventoryHistoryItem
                key={m.id}
                producto={m.producto.nombre}
                stockAnterior={m.stockAnterior}
                stockNuevo={m.stockNuevo}
                tipo={m.tipo}
                cantidad={m.cantidad}
                motivo={m.motivo || ""}
                fecha={formatDate(m.createdAt)}
              />
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}

function OrdersPanel({ pedidos, changeOrder, onDelete }: any) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [pagina, setPagina] = useState(1);

  const totalPaginas = Math.max(1, Math.ceil(pedidos.length / PEDIDOS_POR_PAGINA));

  const pedidosPagina = useMemo(() => {
    const paginaSegura = Math.min(Math.max(1, pagina), totalPaginas);
    const inicio = (paginaSegura - 1) * PEDIDOS_POR_PAGINA;
    return pedidos.slice(inicio, inicio + PEDIDOS_POR_PAGINA);
  }, [pedidos, pagina, totalPaginas]);

  function goToPage(n: number) {
    setExpandedId(null);
    setPagina(Math.min(Math.max(1, n), totalPaginas));
  }

  if (!pedidos.length) {
    return (
      <div className="admin-card">
        <AdminSectionHeader title="Pedidos" subtitle="Gestión de ventas y entregas" />
        <p className="admin-empty-state">No hay pedidos registrados.</p>
      </div>
    );
  }

  const paginaSegura = Math.min(Math.max(1, pagina), totalPaginas);

  return (
    <div className="admin-card admin-card-flush">
      <AdminSectionHeader
        title="Pedidos"
        subtitle={`${pedidos.length} registrados${totalPaginas > 1 ? ` · página ${paginaSegura} de ${totalPaginas}` : ""}`}
      />
      <AdminTableWrap minWidth={1020}>
        <table className="admin-table admin-table-orders">
          <colgroup>
            <col className="admin-col-expand" />
            <col className="admin-col-order" />
            <col className="admin-col-client" />
            <col className="admin-col-delivery" />
            <col className="admin-col-pay" />
            <col className="admin-col-total" />
            <col className="admin-col-status" />
            <col className="admin-col-actions" />
          </colgroup>
          <thead>
            <tr>
              <th aria-label="Detalle" />
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Entrega</th>
              <th>Pago</th>
              <th>Total</th>
              <th>Estado</th>
              <th aria-label="Acciones" />
            </tr>
          </thead>
          <tbody>
            {pedidosPagina.map((p: any) => {
              const open = expandedId === p.id;
              return (
                <Fragment key={p.id}>
                  <tr>
                    <td>
                      <button
                        type="button"
                        onClick={() => setExpandedId(open ? null : p.id)}
                        className="admin-small"
                        aria-label={open ? "Ocultar detalle" : "Ver detalle"}
                      >
                        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </td>
                    <td>
                      <div className="font-medium">{p.numero || `#${p.id}`}</div>
                      <div className="text-xs text-muted">
                        {p.items.length} ítems · {formatDate(p.createdAt)}
                      </div>
                    </td>
                    <td>
                      {p.nombre}
                      <div className="text-xs text-muted">{p.telefono}</div>
                      {p.email ? <div className="text-xs text-muted">{p.email}</div> : null}
                    </td>
                    <td>
                      {p.ciudad}
                      <div className="text-xs text-muted">{p.direccion || "Sin dirección"}</div>
                    </td>
                    <td>
                      <span className="admin-badge admin-badge-green">{p.metodoPago || "—"}</span>
                    </td>
                    <td className="font-medium">{money(p.total)}</td>
                    <td>
                      <select
                        value={p.estado}
                        onChange={(e) => changeOrder(p.id, e.target.value)}
                        className="admin-input admin-input-compact"
                      >
                        {estados.map((e) => (
                          <option key={e} value={e}>
                            {e}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="admin-cell-actions">
                      <button
                        type="button"
                        className="admin-danger"
                        disabled={p.estado !== "entregado"}
                        title={
                          p.estado === "entregado"
                            ? "Eliminar pedido entregado"
                            : "Solo se pueden eliminar pedidos con estado «entregado»"
                        }
                        aria-label={
                          p.estado === "entregado"
                            ? `Eliminar pedido ${p.numero || p.id}`
                            : "Eliminar pedido (solo disponible si está entregado)"
                        }
                        onClick={() => onDelete(p.id, p.numero)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                  {open ? (
                    <tr key={`${p.id}-detail`}>
                      <td colSpan={8} className="admin-order-detail">
                        <AdminBackLink
                          label="Volver a lista de pedidos"
                          onClick={() => setExpandedId(null)}
                          className="mb-3"
                        />
                        <ul className="admin-order-detail-list">
                          {p.items.map((item: any) => (
                            <li key={item.id} className="admin-order-detail-row">
                              <span>
                                {item.nombre} {item.volumen ? `· ${item.volumen}` : ""} × {item.cantidad}
                              </span>
                              <span className="text-muted">{money(item.precioUnitario * item.cantidad)}</span>
                            </li>
                          ))}
                          {p.notas ? <li className="pt-1 text-xs text-muted">Notas: {p.notas}</li> : null}
                        </ul>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </AdminTableWrap>
      <AdminPagination
        pagina={paginaSegura}
        totalPaginas={totalPaginas}
        total={pedidos.length}
        porPagina={PEDIDOS_POR_PAGINA}
        onPageChange={goToPage}
        label="Paginación de pedidos"
      />
    </div>
  );
}
