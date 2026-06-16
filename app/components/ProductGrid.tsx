"use client";

import ProductCard from "./ProductCard";

import type { Producto, ProductoCatalogo } from "../types/producto";

type Props = {
  productos: ProductoCatalogo[];
  categoriaSlug?: string;
  agregarAlCarrito: (producto: Producto) => void;
  abrirModal: (producto: Producto, opciones?: { modoDecant?: boolean }) => void;
  vacio?: string;
};

export default function ProductGrid({
  productos,
  categoriaSlug,
  agregarAlCarrito,
  abrirModal,
  vacio = "No hay productos en esta página",
}: Props) {
  if (productos.length === 0) {
    return (
      <p className="py-16 text-center text-sm uppercase tracking-[0.15em] text-muted">
        {vacio}
      </p>
    );
  }

  return (
    <div className="product-grid">
      {productos.map((producto) => (
        <ProductCard
          key={producto.id}
          {...producto}
          categoriaSlug={categoriaSlug}
          agregarAlCarrito={agregarAlCarrito}
          abrirModal={abrirModal}
        />
      ))}
    </div>
  );
}
