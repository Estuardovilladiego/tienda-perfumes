"use client";

import Image from "next/image";
import Link from "next/link";

type Props = {
  href: string;
  nombre: string;
  imagen: string;
  cantidad?: number;
  className?: string;
};

export default function CategoryCard({
  href,
  nombre,
  imagen,
  cantidad,
  className = "",
}: Props) {
  return (
    <Link
      href={href}
      className={`group relative block aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-zinc-100 shadow-[0_12px_30px_rgba(0,0,0,0.16)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_22px_46px_rgba(0,0,0,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 ${className}`}
    >
      <Image
        src={imagen}
        alt={`Categoría ${nombre}`}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5 transition-colors duration-500 group-hover:from-black/90 group-hover:via-black/45" />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 transition duration-500 group-hover:ring-gold/50" />

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <p className="text-lg font-light uppercase tracking-[0.14em] text-white sm:text-xl sm:tracking-[0.22em]">
          {nombre}
        </p>

        {typeof cantidad === "number" && (
          <p className="mt-1 text-xs text-white/80">
            {cantidad} perfume{cantidad === 1 ? "" : "s"}
          </p>
        )}

        <span className="mt-4 inline-flex translate-y-2 rounded-full border border-gold/60 bg-black/40 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-gold-light opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          Explorar
        </span>
      </div>
    </Link>
  );
}
