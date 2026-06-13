"use client";

import Link from "next/link";

import ProductGrid from "@/app/components/ProductGrid";
import { useCart } from "@/app/providers/CartProvider";
import type { ProductoCatalogo } from "@/app/types/producto";

type Props = {
  productos: ProductoCatalogo[];
};

export default function BestSellers({ productos }: Props) {
  const { agregarAlCarrito, abrirModal } = useCart();

  return (
    <section
      id="mas-vendidos"
      className="scroll-mt-28 bg-[#f7f5f2] py-16 sm:py-24"
    >
      <div className="section-container">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gold">
              Favoritos
            </p>
            <h2 className="section-title mt-3">Más vendidos</h2>
            <p className="section-subtitle mt-2">
              Los perfumes más pedidos por nuestros clientes
            </p>
          </div>
          <Link href="/catalogo" className="btn-primary shrink-0 text-center">
            Ver catálogo completo
          </Link>
        </div>

        <div className="mt-12">
          {productos.length > 0 ? (
            <ProductGrid
              productos={productos}
              agregarAlCarrito={agregarAlCarrito}
              abrirModal={abrirModal}
            />
          ) : (
            <p className="text-center text-sm text-muted">
              Pronto tendremos destacados disponibles.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
