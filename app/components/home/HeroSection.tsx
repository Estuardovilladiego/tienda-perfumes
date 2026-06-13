"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { heroContent } from "@/lib/home-data";

export default function HeroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <section className="relative flex min-h-[100dvh] items-stretch overflow-hidden bg-black">
      <Image
        src={heroContent.image}
        alt={heroContent.imageAlt}
        fill
        priority
        className="object-cover object-center scale-105 transition duration-[12000ms] ease-out hover:scale-100"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,transparent_0%,rgba(0,0,0,0.35)_100%)]" />

      <div className="section-container relative z-10 flex min-h-[100dvh] flex-col justify-end pb-[max(3.5rem,env(safe-area-inset-bottom))] pt-[max(5.5rem,env(safe-area-inset-top))] sm:justify-center sm:pb-20 sm:pt-24 lg:pb-24">
        <div
          className={`max-w-2xl text-center sm:text-left transition-all duration-1000 ease-out ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="mb-4 text-[9px] font-medium uppercase tracking-[0.28em] text-[#d4bc94] sm:text-xs sm:tracking-[0.4em]">
            {heroContent.eyebrow}
          </p>

          <h1 className="text-3xl font-light leading-[1.08] tracking-tight text-white min-[400px]:text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            Descubre
            <br />
            <span className="text-[#d4bc94]">tu esencia</span>
          </h1>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-zinc-300 sm:mt-6 sm:text-lg">
            {heroContent.subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            <Link href="/catalogo" className="btn-primary w-full text-center sm:w-auto">
              Comprar ahora
            </Link>
            <Link
              href="/catalogo"
              className="btn-outline w-full border-white/90 text-center text-white hover:border-white sm:w-auto"
            >
              Explorar catálogo
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 sm:block">
        <div className="h-10 w-px animate-pulse bg-gradient-to-b from-transparent via-[#d4bc94] to-transparent" />
      </div>
    </section>
  );
}
