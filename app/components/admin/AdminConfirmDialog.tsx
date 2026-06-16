"use client";

import { AlertTriangle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export type AdminConfirmOptions = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
};

type PendingConfirm = AdminConfirmOptions & {
  resolve: (value: boolean) => void;
};

type DialogUIProps = AdminConfirmOptions & {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

function AdminConfirmDialogUI({
  open,
  title = "Confirmar acción",
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "default",
  onConfirm,
  onCancel,
}: DialogUIProps) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onCancel]);

  if (!open) return null;

  const esPeligro = variant === "danger";

  return (
    <div
      className="admin-confirm-root"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="admin-confirm-title"
      aria-describedby="admin-confirm-message"
    >
      <button type="button" className="admin-confirm-backdrop" onClick={onCancel} aria-label="Cerrar" />
      <div className="admin-confirm-wrap">
        <div className={`admin-confirm-panel ${esPeligro ? "is-danger" : ""}`}>
          <div className={`admin-confirm-icon ${esPeligro ? "is-danger" : ""}`} aria-hidden>
            <AlertTriangle size={22} strokeWidth={1.5} />
          </div>
          <h2 id="admin-confirm-title" className="admin-confirm-title">
            {title}
          </h2>
          <p id="admin-confirm-message" className="admin-confirm-message">
            {message}
          </p>
          <div className="admin-confirm-actions">
            <button type="button" onClick={onCancel} className="admin-confirm-btn admin-confirm-btn--cancel">
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`admin-confirm-btn ${esPeligro ? "admin-confirm-btn--danger" : "admin-confirm-btn--confirm"}`}
              autoFocus
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function useAdminConfirm() {
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  const confirm = useCallback((options: AdminConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setPending({ ...options, resolve });
    });
  }, []);

  const close = useCallback((result: boolean) => {
    setPending((current) => {
      current?.resolve(result);
      return null;
    });
  }, []);

  const dialog = (
    <AdminConfirmDialogUI
      open={!!pending}
      title={pending?.title}
      message={pending?.message ?? ""}
      confirmLabel={pending?.confirmLabel}
      cancelLabel={pending?.cancelLabel}
      variant={pending?.variant}
      onConfirm={() => close(true)}
      onCancel={() => close(false)}
    />
  );

  return { confirm, dialog };
}
