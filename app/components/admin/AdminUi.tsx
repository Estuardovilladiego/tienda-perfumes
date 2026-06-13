"use client";

import type { ElementType, FormEvent, ReactNode } from "react";

/* ── Encabezados de sección ── */

export function AdminSectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="admin-section-header">
      <div className="min-w-0">
        <h2 className="admin-section-title">{title}</h2>
        {subtitle ? <p className="admin-section-subtitle">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* ── Sidebar ── */

export type AdminTabItem = {
  id: string;
  label: string;
  icon: ElementType<{ size?: number; strokeWidth?: number; "aria-hidden"?: boolean }>;
};

export function AdminSidebar({
  id = "admin-sidebar",
  tabs,
  active,
  onChange,
}: {
  id?: string;
  tabs: AdminTabItem[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <aside id={id} className="admin-sidebar" aria-label="Navegación del panel">
      <p className="admin-sidebar-label">Menú</p>
      <nav className="admin-sidebar-nav">
        {tabs.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`admin-sidebar-item ${isActive ? "admin-sidebar-item-active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={18} strokeWidth={1.75} aria-hidden />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

/* ── Tabla con scroll único ── */

export function AdminTableWrap({
  children,
  minWidth = 640,
  fit = false,
}: {
  children: ReactNode;
  minWidth?: number;
  /** Sin ancho mínimo forzado: la tabla usa todo el ancho disponible */
  fit?: boolean;
}) {
  return (
    <div className="admin-table-wrap">
      <div
        className={`admin-table-scroll ${fit ? "admin-table-scroll-fit" : ""}`}
        style={fit ? undefined : { ["--admin-table-min" as string]: `${minWidth}px` }}
      >
        {children}
      </div>
    </div>
  );
}

/* ── Formulario ajuste inventario ── */

export function InventoryAdjustForm({
  productoId,
  loading,
  onSubmit,
  layout = "inline",
}: {
  productoId: number;
  loading: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  layout?: "inline" | "stacked";
}) {
  return (
    <form
      onSubmit={onSubmit}
      className={layout === "stacked" ? "admin-adjust-form admin-adjust-form-stacked" : "admin-adjust-form"}
    >
      <input type="hidden" name="productoId" value={productoId} />
      <label className="admin-adjust-field">
        <span className="sr-only">Acción</span>
        <select name="modo" className="admin-input admin-input-compact" defaultValue="incrementar">
          <option value="incrementar">Sumar</option>
          <option value="reducir">Restar</option>
          <option value="ajustar">Fijar</option>
        </select>
      </label>
      <label className="admin-adjust-field">
        <span className="sr-only">Cantidad</span>
        <input
          name="cantidad"
          type="number"
          min={0}
          required
          placeholder="Cant."
          className="admin-input admin-input-compact"
        />
      </label>
      <label className="admin-adjust-field admin-adjust-field-grow">
        <span className="sr-only">Motivo</span>
        <input name="motivo" placeholder="Motivo del ajuste" className="admin-input admin-input-compact" />
      </label>
      <button type="submit" className="admin-primary admin-btn-compact" disabled={loading}>
        Guardar
      </button>
    </form>
  );
}

/* ── Historial inventario ── */

export function InventoryHistoryItem({
  producto,
  stockAnterior,
  stockNuevo,
  tipo,
  cantidad,
  motivo,
  fecha,
}: {
  producto: string;
  stockAnterior: number;
  stockNuevo: number;
  tipo: string;
  cantidad: number;
  motivo: string;
  fecha: string;
}) {
  const delta = stockNuevo - stockAnterior;
  const deltaLabel = delta > 0 ? `+${delta}` : String(delta);

  return (
    <article className="admin-history-item">
      <div className="admin-history-item-top">
        <p className="admin-history-product">{producto}</p>
        <span className={`admin-history-delta ${delta >= 0 ? "admin-history-delta-up" : "admin-history-delta-down"}`}>
          {deltaLabel}
        </span>
      </div>
      <div className="admin-history-stock">
        <span>{stockAnterior}</span>
        <span aria-hidden>→</span>
        <strong>{stockNuevo}</strong>
      </div>
      <p className="admin-history-meta">
        <span className="admin-history-tag">{tipo}</span>
        <span>{cantidad} uds.</span>
        {motivo ? <span>{motivo}</span> : null}
      </p>
      <time className="admin-history-date">{fecha}</time>
    </article>
  );
}

/* ── Badge stock ── */

export function StockBadge({ stock }: { stock: number }) {
  const cls =
    stock === 0 ? "admin-badge-red" : stock < 5 ? "admin-badge-amber" : "admin-badge-green";
  return <span className={`admin-badge ${cls}`}>{stock}</span>;
}

/* ── Layout página ── */

export function AdminPageLayout({
  sidebar,
  sidebarOpen,
  children,
}: {
  sidebar: ReactNode;
  sidebarOpen: boolean;
  onToggleSidebar?: () => void;
  children: ReactNode;
}) {
  return (
    <div
      id="admin-main"
      className={`admin-page-layout ${sidebarOpen ? "" : "admin-sidebar-collapsed"}`}
    >
      {sidebarOpen ? sidebar : null}
      <section className="admin-page-content">{children}</section>
    </div>
  );
}

function paginasVisibles(actual: number, total: number): (number | "ellipsis")[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const paginas: (number | "ellipsis")[] = [1];

  if (actual > 3) paginas.push("ellipsis");

  const inicio = Math.max(2, actual - 1);
  const fin = Math.min(total - 1, actual + 1);

  for (let n = inicio; n <= fin; n++) {
    paginas.push(n);
  }

  if (actual < total - 2) paginas.push("ellipsis");

  if (total > 1) paginas.push(total);

  return paginas;
}

export function AdminPagination({
  pagina,
  totalPaginas,
  total,
  porPagina,
  onPageChange,
  label = "Paginación",
}: {
  pagina: number;
  totalPaginas: number;
  total: number;
  porPagina: number;
  onPageChange: (pagina: number) => void;
  label?: string;
}) {
  if (total <= 0) return null;

  const inicio = (pagina - 1) * porPagina + 1;
  const fin = Math.min(pagina * porPagina, total);
  const visibles = paginasVisibles(pagina, totalPaginas);

  return (
    <div className="admin-pagination">
      <p className="admin-pagination-meta">
        Mostrando {inicio}–{fin} de {total}
      </p>
      {totalPaginas > 1 ? (
        <nav className="admin-pagination-nav" aria-label={label}>
        <button
          type="button"
          className="admin-pagination-btn"
          disabled={pagina <= 1}
          onClick={() => onPageChange(pagina - 1)}
        >
          Anterior
        </button>
        {visibles.map((n, i) =>
          n === "ellipsis" ? (
            <span key={`ellipsis-${i}`} className="admin-pagination-ellipsis" aria-hidden>
              …
            </span>
          ) : (
            <button
              key={n}
              type="button"
              className={`admin-pagination-page ${n === pagina ? "is-active" : ""}`}
              aria-current={n === pagina ? "page" : undefined}
              onClick={() => onPageChange(n)}
            >
              {n}
            </button>
          )
        )}
        <button
          type="button"
          className="admin-pagination-btn"
          disabled={pagina >= totalPaginas}
          onClick={() => onPageChange(pagina + 1)}
        >
          Siguiente
        </button>
        </nav>
      ) : null}
    </div>
  );
}
