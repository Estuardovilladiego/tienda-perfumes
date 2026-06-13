import type { Metadata } from "next";

import type { ProductoCatalogo } from "@/app/types/producto";
import { slugProducto, urlProductoAbsoluta } from "@/lib/producto-slug";
import { getSiteUrl, site } from "@/lib/site";

export function metadataOpenGraph(
  partial: Pick<Metadata, "title" | "description"> & {
    path?: string;
    images?: string[];
  }
): Metadata {
  const base = getSiteUrl();
  const url = partial.path ? `${base}${partial.path}` : base;
  const images = (partial.images ?? [`${base}${site.logo}`]).map((img) =>
    img.startsWith("http") ? img : `${base}${img.startsWith("/") ? img : `/${img}`}`
  );

  return {
    title: partial.title,
    description: partial.description,
    openGraph: {
      title: typeof partial.title === "string" ? partial.title : undefined,
      description: partial.description ?? undefined,
      url,
      siteName: site.nombreCompleto,
      locale: "es_CO",
      type: "website",
      images: images.map((urlImg) => ({ url: urlImg })),
    },
    alternates: { canonical: url },
  };
}

export function jsonLdOrganization() {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: site.nombreCompleto,
    description: "Perfumería con fragancias 1.1 en Barranquilla, Colombia.",
    url: base,
    logo: `${base}${site.logo}`,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Barranquilla",
      addressCountry: "CO",
    },
    sameAs: [site.instagram, site.tiktok],
  };
}

export function jsonLdProduct(producto: ProductoCatalogo) {
  const base = getSiteUrl();
  const slug = producto.slug ?? slugProducto(producto.nombre);
  const image = producto.imagen.startsWith("http")
    ? producto.imagen
    : `${base}${producto.imagen}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    description: producto.marca
      ? `${producto.nombre} de ${producto.marca} — ${producto.volumen}`
      : `${producto.nombre} — ${producto.volumen}`,
    image: [image],
    brand: producto.marca
      ? { "@type": "Brand", name: producto.marca }
      : undefined,
    offers: {
      "@type": "Offer",
      url: urlProductoAbsoluta(slug, base),
      priceCurrency: "COP",
      price: producto.precio,
      availability:
        (producto.stock ?? 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: site.nombreCompleto },
    },
  };
}
