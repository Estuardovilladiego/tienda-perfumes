"use client";

import Link from "next/link";

import { useCart } from "@/app/providers/CartProvider";

import ProductGrid from "./ProductGrid";

import type { ProductoCatalogo } from "../types/producto";

type Props = {
  destacados: ProductoCatalogo[];
};

export default function Products({ destacados }: Props) {
  const { agregarAlCarrito, abrirModal } = useCart();

  return (
    <section id="nuevos" className="scroll-mt-32 border-b border-border bg-[#f3f3f3] py-14 sm:py-16">
      <div className="section-container">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="section-title">Destacados</h2>
            <p className="section-subtitle">
              Algunos de nuestros perfumes más pedidos
            </p>
          </div>
          <Link href="/catalogo" className="btn-primary shrink-0 text-center">
            Ver catálogo completo
          </Link>
        </div>

        <div className="mt-10">
          <ProductGrid
            productos={destacados}
            agregarAlCarrito={agregarAlCarrito}
            abrirModal={abrirModal}
          />
        </div>
      </div>
    </section>
  );
}
