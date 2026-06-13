"use client";

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import PageBackLink from "@/app/components/navigation/PageBackLink";
import PageBreadcrumbs from "@/app/components/navigation/PageBreadcrumbs";
import { useCart } from "@/app/providers/CartProvider";

type Props = {
  titulo: string;
  descripcion?: string;
  backLabel?: string;
  backHref?: string;
  children: React.ReactNode;
};

export default function LegalPageShell({
  titulo,
  descripcion,
  backLabel = "Inicio",
  backHref = "/",
  children,
}: Props) {
  const { cantidad, subtotal, abrirCarrito } = useCart();

  return (
    <main className="min-h-screen bg-white text-foreground">
      <Navbar abrirCarrito={abrirCarrito} cantidad={cantidad} subtotal={subtotal} />

      <div className="section-container py-10 sm:py-14">
        <PageBackLink href={backHref} label={backLabel} />
        <PageBreadcrumbs
          className="mt-3"
          items={[
            { label: "Inicio", href: "/" },
            { label: titulo },
          ]}
        />

        <header className="mx-auto mt-6 max-w-3xl border-b border-border pb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gold">
            Essenza Perfumería
          </p>
          <h1 className="mt-3 text-2xl font-light tracking-tight sm:text-3xl">{titulo}</h1>
          {descripcion ? (
            <p className="mt-3 text-sm leading-relaxed text-muted">{descripcion}</p>
          ) : null}
        </header>

        <div className="prose-legal mx-auto mt-8 max-w-3xl">{children}</div>
      </div>

      <Footer />
    </main>
  );
}
