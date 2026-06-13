import Link from "next/link";

import { promoBanner } from "@/lib/home-data";

export default function PromoBanner() {
  return (
    <section className="relative overflow-hidden bg-foreground py-20 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(184,149,108,0.15)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(212,188,148,0.1)_0%,transparent_45%)]" />

      <div className="section-container relative z-10 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d4bc94] sm:tracking-[0.4em]">
          Essenza
        </p>
        <h2 className="mt-4 text-2xl font-light uppercase tracking-[0.1em] text-white sm:text-4xl sm:tracking-[0.15em] md:text-5xl">
          {promoBanner.line1}
        </h2>
        <p className="mt-3 text-sm tracking-wide text-zinc-400 sm:text-base">
          {promoBanner.line2}
        </p>
        <Link
          href={promoBanner.href}
          className="btn-primary mt-10 border border-[#d4bc94]/30 bg-[#d4bc94] text-foreground hover:bg-[#c9a87a]"
        >
          {promoBanner.cta}
        </Link>
      </div>
    </section>
  );
}
