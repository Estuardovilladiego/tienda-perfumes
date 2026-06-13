import Link from "next/link";

import Footer from "@/app/components/Footer";
import PageBackLink from "@/app/components/navigation/PageBackLink";
import PageBreadcrumbs from "@/app/components/navigation/PageBreadcrumbs";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white text-foreground">
      <div className="section-container py-16 sm:py-24">
        <PageBackLink href="/" label="Inicio" className="mb-4" />
        <PageBreadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Página no encontrada" },
          ]}
          className="mb-8"
        />

        <h1 className="text-3xl font-light tracking-tight sm:text-4xl">Página no encontrada</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
          La dirección que buscas no existe o el producto ya no está disponible.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/catalogo" className="btn-primary text-center">
            Ver catálogo
          </Link>
          <Link href="/categorias" className="btn-outline text-center">
            Ver categorías
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
