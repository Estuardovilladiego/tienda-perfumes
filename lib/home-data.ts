/** Contenido estático de la home — preparado para CMS/API futura. */

export const heroContent = {
  eyebrow: "Perfumería exclusiva · Barranquilla",
  title: "Descubre tu esencia",
  subtitle:
    "Perfumes 1.1 para quienes desean destacar con excelente fidelidad olfativa.",
  image: "/imagenes/dior-sauvage.jpg",
  imageAlt: "Colección premium Essenza",
};

export const promoBanner = {
  line1: "Perfumes 1.1",
  line2: "Envíos seguros a toda Colombia",
  cta: "Explorar",
  href: "/catalogo",
};

export const benefits = [
  {
    title: "Perfumes 1.1",
    description: "Fragancias de inspiración con alta fidelidad olfativa y gran duración.",
    icon: "sparkles" as const,
  },
  {
    title: "Envíos nacionales",
    description: "Llevamos tu esencia a donde estés en Colombia.",
    icon: "truck" as const,
  },
  {
    title: "Pagos seguros",
    description: "Nequi, Bancolombia y Daviplata. Compra con confianza.",
    icon: "shield" as const,
  },
  {
    title: "Atención personalizada",
    description: "Te asesoramos para encontrar tu fragancia ideal.",
    icon: "heart" as const,
  },
];

export const featuredBrands = [
  "Dior",
  "Chanel",
  "Versace",
  "Lattafa",
  "Armaf",
  "Rasasi",
  "Carolina Herrera",
];

export const ctaSection = {
  title: "Tu próxima firma olfativa te espera",
  subtitle: "Explora el catálogo completo y encuentra el perfume que te define.",
  button: "Ir al catálogo",
  href: "/catalogo",
};

export const paymentMethods = [
  "Nequi",
  "Daviplata",
  "Llaves Bre-B",
  "Bancolombia",
  "Falabella",
  "Sistecredito",
  "Addi",
] as const;
