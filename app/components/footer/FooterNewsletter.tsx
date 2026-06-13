"use client";

import { useState } from "react";

import { suscribirNewsletterCliente } from "@/lib/client-api";

export default function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valor = email.trim();
    if (!valor) return;

    setCargando(true);
    setError("");

    const resultado = await suscribirNewsletterCliente(valor);
    setCargando(false);

    if (resultado.ok) {
      setMensaje(resultado.data.mensaje);
      setEnviado(true);
      setEmail("");
      return;
    }

    if (resultado.error.includes("requiere MySQL")) {
      setMensaje("¡Gracias! Te avisaremos cuando activemos el registro en base de datos.");
      setEnviado(true);
      setEmail("");
      return;
    }

    setError(resultado.error);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] sm:p-8">
      <h3 className="text-sm font-medium uppercase tracking-[0.25em] text-[#d4bc94]">
        Recibe nuestras novedades
      </h3>
      <p className="mt-2 max-w-md text-sm text-zinc-400">
        Ofertas exclusivas, lanzamientos y recomendaciones de fragancias.
      </p>

      {enviado ? (
        <p
          className="mt-5 text-sm text-[#d4bc94]"
          role="status"
          aria-live="polite"
        >
          {mensaje || "¡Gracias! Pronto recibirás nuestras novedades."}
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-stretch"
        >
          <label htmlFor="footer-email" className="sr-only">
            Correo electrónico
          </label>
          <input
            id="footer-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            className="min-w-0 flex-1 rounded-full border border-zinc-700 bg-zinc-950/80 px-5 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#d4bc94]/50 focus:ring-1 focus:ring-[#d4bc94]/30"
          />
          <button
            type="submit"
            disabled={cargando}
            className="shrink-0 rounded-full border border-[#d4bc94]/40 bg-[#d4bc94] px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-900 transition hover:bg-[#e5d4b8] hover:shadow-[0_4px_20px_rgba(212,188,148,0.25)] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
          >
            {cargando ? "Enviando…" : "Suscribirme"}
          </button>
        </form>
      )}
      {error ? (
        <p className="mt-3 text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
