"use client";

import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function AdminProductModal({ open, onClose, title, subtitle, children }: Props) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="admin-modal-root" role="dialog" aria-modal="true" aria-labelledby="admin-product-modal-title">
      <button type="button" className="admin-modal-backdrop" onClick={onClose} aria-label="Cerrar modal" />
      <div className="admin-modal-wrap">
        <div className="admin-modal-panel">
          <header className="admin-modal-header">
            <div className="min-w-0 pr-4">
              <p className="admin-modal-eyebrow">Gestión de producto</p>
              <h2 id="admin-product-modal-title" className="admin-modal-title">
                {title}
              </h2>
              {subtitle ? <p className="admin-modal-subtitle">{subtitle}</p> : null}
            </div>
            <button type="button" onClick={onClose} className="admin-modal-close" aria-label="Cerrar">
              <X size={20} />
            </button>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
