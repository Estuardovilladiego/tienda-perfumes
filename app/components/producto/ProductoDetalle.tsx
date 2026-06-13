"use client";

import { useRouter } from "next/navigation";

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import PageBackLink from "@/app/components/navigation/PageBackLink";
import PageBreadcrumbs from "@/app/components/navigation/PageBreadcrumbs";
import ProductModal from "@/app/components/ProductModal";
import { useCart } from "@/app/providers/CartProvider";
import type { Producto, ProductoCatalogo } from "@/app/types/producto";
import { destinoVolverProducto } from "@/lib/producto-navigation";

type Props = {
  producto: ProductoCatalogo;
  urlProducto: string;
};

export default function ProductoDetalle({ producto, urlProducto }: Props) {
  const router = useRouter();
  const { agregarAlCarrito, comprarAhora, cantidad, subtotal, abrirCarrito } = useCart();

  const item: Producto = { ...producto, cantidad: 1 };
  const volver = destinoVolverProducto(producto);

  const cerrar = () => {
    router.push(volver.href);
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] text-foreground">
      <Navbar abrirCarrito={abrirCarrito} cantidad={cantidad} subtotal={subtotal} />

      <div className="section-container py-4 sm:py-6">
        <PageBackLink href={volver.href} label={volver.label} />
        <PageBreadcrumbs
          className="mt-3"
          items={[
            { label: "Inicio", href: "/" },
            { label: "Catálogo", href: "/catalogo" },
            ...(producto.categorias[0]
              ? [
                  {
                    label: producto.categorias[0].nombre,
                    href: `/categorias/${producto.categorias[0].slug}`,
                  },
                ]
              : []),
            { label: producto.nombre },
          ]}
        />
      </div>

      <ProductModal
        abierto
        cerrar={cerrar}
        producto={item}
        urlProducto={urlProducto}
        agregarAlCarrito={agregarAlCarrito}
        comprarAhora={comprarAhora}
      />

      <Footer />
    </main>
  );
}
