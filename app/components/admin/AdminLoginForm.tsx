"use client";

import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });

    setLoading(false);
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error || "No se pudo iniciar sesión");
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="admin-form-stack">
      <div>
        <label className="admin-label" htmlFor="admin-email">
          Email
        </label>
        <input id="admin-email" name="email" type="email" required className="admin-input" />
      </div>
      <div>
        <label className="admin-label" htmlFor="admin-password">
          Contraseña
        </label>
        <input id="admin-password" name="password" type="password" required className="admin-input" />
      </div>
      {error ? <p className="rounded-xl admin-alert-error px-3 py-2 text-sm">{error}</p> : null}
      <button type="submit" disabled={loading} className="admin-primary w-full">
        <LogIn size={17} />
        {loading ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
