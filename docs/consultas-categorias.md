# Categorías múltiples — consultas y tipos

## Modelo de datos (MySQL)

```
Producto (1) ──< ProductoCategoria >── (N) Categoria
```

- Un perfume puede estar en **Hombre** y **Árabes** a la vez.
- Filtrar por `hombre` devuelve todos los que tengan esa etiqueta, incluidos los árabes masculinos.

## TypeScript

```typescript
import type { CategoriaRef, ProductoCatalogo } from "@/app/types/producto";
import { productoTieneCategoria, formatearCategorias } from "@/lib/categoria-producto";

const asad: ProductoCatalogo = {
  id: 1,
  nombre: "Asad",
  categorias: [
    { nombre: "Hombre", slug: "hombre" },
    { nombre: "Árabes", slug: "arabes" },
  ],
  // ...
};

productoTieneCategoria(asad, "hombre"); // true
productoTieneCategoria(asad, "arabes"); // true
formatearCategorias(asad); // "Hombre, Árabes"
```

## Prisma (Next.js)

```typescript
// Perfumes de la categoría Mujer (incluye Yara = Mujer + Árabes)
const productos = await prisma.producto.findMany({
  where: {
    activo: true,
    categorias: {
      some: { categoria: { slug: "mujer" } },
    },
  },
  include: {
    categorias: { include: { categoria: true } },
    marca: true,
  },
});
```

## SQL directo

Ver `prisma/sql/migrar-producto-categoria.sql` para migración y ejemplos `SELECT`.
