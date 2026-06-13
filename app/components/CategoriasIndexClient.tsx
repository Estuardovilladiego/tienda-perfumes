"use client";

import CategoryCard from "@/app/components/CategoryCard";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import PageBackLink from "@/app/components/navigation/PageBackLink";
import PageBreadcrumbs from "@/app/components/navigation/PageBreadcrumbs";
import { useCart } from "@/app/providers/CartProvider";

type CategoriaCard = {
  nombre: string;
  slug: string;
  imagen: string;
  cantidad: number;
};

type Props = {
  categorias: CategoriaCard[];
};

export default function CategoriasIndexClient({ categorias }: Props) {
  const { cantidad, subtotal, abrirCarrito } = useCart();

  return (
    <main className="min-h-screen bg-white text-foreground">
      <Navbar
        abrirCarrito={abrirCarrito}
        cantidad={cantidad}
        subtotal={subtotal}
      />

      <div className="border-b border-zinc-200 bg-white">
        <div className="section-container py-6 sm:py-10">
          <PageBackLink href="/" label="Inicio" />
          <PageBreadcrumbs
            className="mt-3"
            items={[
              { label: "Inicio", href: "/" },
              { label: "Categorías" },
            ]}
          />
          <h1 className="mt-5 text-2xl font-light uppercase tracking-[0.16em] text-foreground sm:text-3xl sm:tracking-[0.25em]">
            Categorías
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Elige una colección para ver sus perfumes
          </p>
        </div>
      </div>

      <section className="border-t border-border bg-cream/40 py-14 sm:py-20">
        <div className="section-container">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {categorias.map((cat) => (
              <CategoryCard
                key={cat.slug}
                href={`/categorias/${cat.slug}`}
                nombre={cat.nombre}
                imagen={cat.imagen}
                cantidad={cat.cantidad}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
