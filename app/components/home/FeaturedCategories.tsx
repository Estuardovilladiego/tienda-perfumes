import Link from "next/link";

import CategoryCard from "@/app/components/CategoryCard";
import { CATEGORIAS } from "@/lib/categorias";

export default function FeaturedCategories() {
  return (
    <section
      id="categorias"
      className="scroll-mt-28 border-b border-border bg-white py-16 sm:py-24"
    >
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gold">
            Colecciones
          </p>
          <h2 className="section-title mt-3">Categorías destacadas</h2>
          <p className="section-subtitle mx-auto mt-2">
            Encuentra la fragancia perfecta para cada momento
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {CATEGORIAS.map((cat) => (
            <CategoryCard
              key={cat.slug}
              href={`/categorias/${cat.slug}`}
              nombre={cat.nombre}
              imagen={cat.imagen}
              className="rounded-3xl"
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/categorias"
            className="text-xs font-medium uppercase tracking-[0.2em] text-muted transition hover:text-gold"
          >
            Ver todas las categorías →
          </Link>
        </div>
      </div>
    </section>
  );
}
