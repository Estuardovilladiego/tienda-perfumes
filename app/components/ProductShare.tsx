"use client";

import { Link2 } from "lucide-react";
import { useState } from "react";

import { site, whatsappUrl } from "@/lib/site";

type Props = {
  nombre: string;
  urlProducto: string;
  className?: string;
};

export default function ProductShare({ nombre, urlProducto, className = "" }: Props) {
  const [copiado, setCopiado] = useState(false);
  const textoWhatsApp = `Mira este perfume en Essenza: ${nombre} ${urlProducto}`;

  async function copiarEnlace() {
    try {
      await navigator.clipboard.writeText(urlProducto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* clipboard no disponible */
    }
  }

  return (
    <div className={className}>
      <p className="text-sm font-semibold text-foreground">Compartir</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copiarEnlace}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium transition hover:border-gold/40"
        >
          <Link2 size={14} />
          {copiado ? "Enlace copiado" : "Copiar enlace"}
        </button>
        <a
          href={whatsappUrl(textoWhatsApp)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-4 py-2 text-xs font-medium text-[#128C7E] transition hover:bg-[#25D366]/20"
        >
          WhatsApp
        </a>
        <a
          href={site.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium transition hover:border-gold/40"
        >
          {site.instagramHandle}
        </a>
      </div>
    </div>
  );
}
