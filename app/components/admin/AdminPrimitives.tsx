"use client";

import type { ElementType, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

/* ── Card ── */

export function AdminCard({
  children,
  className = "",
  flush = false,
}: {
  children: ReactNode;
  className?: string;
  flush?: boolean;
}) {
  return (
    <div className={`admin-card ${flush ? "admin-card-flush" : ""} ${className}`.trim()}>{children}</div>
  );
}

/* ── Form group ── */

export function AdminFormGroup({
  title,
  description,
  children,
  columns = 2,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  columns?: 1 | 2;
}) {
  return (
    <fieldset className="admin-form-group">
      <legend className="admin-form-group-title">{title}</legend>
      {description ? <p className="admin-form-group-desc">{description}</p> : null}
      <div
        className={`admin-form-group-body ${columns === 1 ? "admin-form-group-body-single" : ""}`.trim()}
      >
        {children}
      </div>
    </fieldset>
  );
}

/* ── Field ── */

type FieldProps = {
  label: string;
  hint?: string;
  required?: boolean;
  className?: string;
};

export function AdminFieldInput({
  label,
  hint,
  required,
  className = "",
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`admin-field ${className}`.trim()}>
      <span className="admin-label">
        {label}
        {required ? <span className="admin-label-required"> *</span> : null}
      </span>
      <input {...props} required={required} className="admin-input" />
      {hint ? <span className="admin-field-hint">{hint}</span> : null}
    </label>
  );
}

export function AdminFieldTextarea({
  label,
  hint,
  required,
  className = "",
  ...props
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className={`admin-field ${className}`.trim()}>
      <span className="admin-label">
        {label}
        {required ? <span className="admin-label-required"> *</span> : null}
      </span>
      <textarea {...props} required={required} className="admin-input admin-textarea" />
      {hint ? <span className="admin-field-hint">{hint}</span> : null}
    </label>
  );
}

export function AdminFieldSelect({
  label,
  hint,
  required,
  className = "",
  children,
  ...props
}: FieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className={`admin-field ${className}`.trim()}>
      <span className="admin-label">
        {label}
        {required ? <span className="admin-label-required"> *</span> : null}
      </span>
      <select {...props} required={required} className="admin-input admin-select">
        {children}
      </select>
      {hint ? <span className="admin-field-hint">{hint}</span> : null}
    </label>
  );
}

/* ── Button ── */

type BtnVariant = "primary" | "secondary" | "soft" | "ghost" | "danger";

const btnClass: Record<BtnVariant, string> = {
  primary: "admin-primary admin-btn-premium",
  secondary: "admin-btn admin-btn-premium",
  soft: "admin-btn admin-btn-soft admin-btn-premium",
  ghost: "admin-btn admin-btn-ghost admin-btn-premium",
  danger: "admin-danger admin-btn-premium",
};

export function AdminButton({
  variant = "secondary",
  icon: Icon,
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BtnVariant;
  icon?: ElementType<{ size?: number; className?: string }>;
}) {
  return (
    <button type="button" className={`${btnClass[variant]} ${className}`.trim()} {...props}>
      {Icon ? <Icon size={16} strokeWidth={1.75} aria-hidden /> : null}
      {children}
    </button>
  );
}

/* ── Toolbar ── */

export function AdminToolbar({ children }: { children: ReactNode }) {
  return <div className="admin-toolbar">{children}</div>;
}

export function AdminToolbarSearch({
  value,
  onChange,
  placeholder = "Buscar…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="admin-toolbar-search">
      <span className="sr-only">Buscar</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="admin-input"
      />
    </label>
  );
}

/* ── Product mobile card ── */

export type AdminProductoListItem = {
  nombre: string;
  marca?: string;
  sku?: string;
  precio: number;
  stock: number;
  activo: boolean;
  imagen?: string | null;
  categorias: { id: number; nombre: string }[];
};

export function AdminProductCard({
  producto,
  onEdit,
  onDelete,
}: {
  producto: AdminProductoListItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const stock = producto.stock;
  const badge =
    stock === 0 ? "admin-badge-red" : stock < 5 ? "admin-badge-amber" : "admin-badge-green";

  return (
    <article className={`admin-product-card ${!producto.activo ? "opacity-60" : ""}`}>
      <div className="admin-product-card-main">
        {producto.imagen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={producto.imagen} alt="" className="admin-product-card-thumb" />
        ) : (
          <div className="admin-product-card-thumb admin-product-card-thumb-empty" aria-hidden />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="admin-product-card-name">{producto.nombre}</h3>
          <p className="admin-product-card-meta">
            {producto.marca} · {producto.sku || "Sin SKU"}
          </p>
          <p className="admin-product-card-cats">
            {producto.categorias.map((c) => c.nombre).join(", ") || "—"}
          </p>
        </div>
      </div>
      <div className="admin-product-card-footer">
        <span className="admin-product-card-price">
          ${Number(producto.precio || 0).toLocaleString("es-CO")}
        </span>
        <span className={`admin-badge ${badge}`}>{stock}</span>
        <div className="admin-product-card-actions">
          <button type="button" onClick={onEdit} className="admin-small">
            Editar
          </button>
          <button type="button" onClick={onDelete} className="admin-danger" aria-label="Desactivar">
            ×
          </button>
        </div>
      </div>
    </article>
  );
}
