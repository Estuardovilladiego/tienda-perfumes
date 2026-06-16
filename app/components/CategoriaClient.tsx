"use client";

import { useCart } from "@/app/providers/CartProvider";
import CategoriaHeader from "@/app/components/CategoriaHeader";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import Pagination from "@/app/components/Pagination";
import ProductGrid from "@/app/components/ProductGrid";

import type { ProductosPaginados } from "@/lib/productos";

type Props = ProductosPaginados & {
  categoriaNombre: string;
  categoriaSlug: string;
  mostrarAvisoDemo?: boolean;
};

export default function CategoriaClient({
  productos,
  total,
  pagina,
  totalPaginas,
  busqueda,
  categoriaNombre,
  categoriaSlug,
  orden,
  marca,
  marcas,
  mostrarAvisoDemo = false,
}: Props) {
  const { agregarAlCarrito, abrirModal, cantidad, subtotal, abrirCarrito } =
    useCart();

  return (
    <main className="min-h-screen bg-white text-foreground">
      {mostrarAvisoDemo && (
        <div className="border-b border-amber-200/80 bg-amber-50/90 px-4 py-2.5 text-center text-xs text-amber-950">
          Modo demo — catálogo en archivo (sin MySQL)
        </div>
      )}

      <Navbar
        abrirCarrito={abrirCarrito}
        cantidad={cantidad}
        subtotal={subtotal}
      />

      <CategoriaHeader
        nombre={categoriaNombre}
        slug={categoriaSlug}
        busqueda={busqueda}
        total={total}
        orden={orden}
        marca={marca}
        marcas={marcas}
      />

      <section className="bg-[#faf8f5] py-8 sm:py-12">
        <div className="section-container">
          {productos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
              <p className="text-sm font-medium text-zinc-700">
                No hay perfumes en esta categoría
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                Prueba otra búsqueda o explora el catálogo completo
              </p>
            </div>
          ) : (
            <>
              <ProductGrid
                productos={productos}
                categoriaSlug={categoriaSlug}
                agregarAlCarrito={agregarAlCarrito}
                abrirModal={abrirModal}
              />
              <Pagination
                pagina={pagina}
                totalPaginas={totalPaginas}
                busqueda={busqueda}
                orden={orden}
                marca={marca}
                categoriaSlug={categoriaSlug}
              />
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
