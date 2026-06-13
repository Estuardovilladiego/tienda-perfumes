import Link from "next/link";

import CategoryCard from "@/app/components/CategoryCard";
import { CATEGORIAS } from "@/lib/categorias";

export default function Categories() {
  return (
    <section
      id="categorias"
      className="scroll-mt-24 border-t border-border bg-cream/40 py-14 sm:py-20"
    >
      <div className="section-container">
        <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="section-title">Categorías</h2>
            <p className="section-subtitle">Explora por tipo de fragancia</p>
          </div>
          <Link
            href="/categorias"
            className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-600 transition hover:text-[#b8956c]"
          >
            Ver todas →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {CATEGORIAS.map((cat) => (
            <CategoryCard
              key={cat.slug}
              href={`/categorias/${cat.slug}`}
              nombre={cat.nombre}
              imagen={cat.imagen}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
