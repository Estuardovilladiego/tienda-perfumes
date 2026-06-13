import Link from "next/link";

import { ctaSection } from "@/lib/home-data";

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-gradient-to-b from-white to-cream py-20 sm:py-28">
      <div className="section-container relative z-10 text-center">
        <div className="mx-auto h-px w-16 bg-gold" />
        <h2 className="mt-8 text-2xl font-light uppercase tracking-[0.1em] sm:text-4xl sm:tracking-[0.12em]">
          {ctaSection.title}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-muted sm:text-base">
          {ctaSection.subtitle}
        </p>
        <Link href={ctaSection.href} className="btn-primary mt-10 w-full max-w-xs sm:w-auto">
          {ctaSection.button}
        </Link>
      </div>
    </section>
  );
}
