import { Star } from "lucide-react";
import Link from "next/link";

import { site } from "@/lib/site";
import { testimonials } from "@/lib/testimonials";

export default function Testimonials() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="section-container">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gold">
            Clientes
          </p>
          <h2 className="section-title mt-3">Lo que dicen de nosotros</h2>
          <p className="mt-3 text-sm text-muted">
            Reseñas de clientes en Barranquilla y alrededores.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <article
              key={`${t.name}-${t.product ?? t.text.slice(0, 20)}`}
              className="flex flex-col rounded-sm border border-border bg-[#faf8f5] p-8 transition duration-300 hover:border-gold/25 hover:shadow-lg"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-0.5 text-gold">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                {t.source ? (
                  <span className="text-[10px] uppercase tracking-wider text-muted">
                    {t.source}
                  </span>
                ) : null}
              </div>
              <p className="mt-5 flex-1 text-sm leading-relaxed text-foreground/90">
                &ldquo;{t.text}&rdquo;
              </p>
              <footer className="mt-6 border-t border-border pt-4">
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted">{t.city}</p>
                {t.product ? (
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-gold">
                    {t.product}
                  </p>
                ) : null}
              </footer>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted">
          ¿Ya compraste con nosotros?{" "}
          <Link
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-gold underline-offset-2 hover:underline"
          >
            Cuéntanos en Instagram
          </Link>
        </p>
      </div>
    </section>
  );
}
