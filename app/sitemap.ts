import type { MetadataRoute } from "next";

import { getCategoriasPublicas } from "@/lib/categorias-publicas";
import { getProductos } from "@/lib/productos";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/catalogo`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/categorias`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/preguntas-frecuentes`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terminos`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/metodos-pago`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const [{ productos }, categorias] = await Promise.all([
    getProductos(),
    getCategoriasPublicas(),
  ]);

  const productRoutes: MetadataRoute.Sitemap = productos.map((p) => ({
    url: `${base}/producto/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categorias.map((c) => ({
    url: `${base}/categorias/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
