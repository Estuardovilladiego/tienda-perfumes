export const site = {
  nombre: "Essenza",
  nombreCompleto: "Essenza Perfumería",
  tagline: "Perfumería",
  ciudad: "Barranquilla, Colombia",
  /** Correo principal de contacto */
  email: "essenzaperfumeria312@gmail.com",
  whatsapp: "573172676469",
  whatsappDisplay: "317 267 6469",
  instagram: "https://www.instagram.com/essenza.perfumeriabq",
  instagramHandle: "@essenza.perfumeriabq",
  tiktok: "https://www.tiktok.com/@essenza_perfumeriabq",
  tiktokHandle: "@essenza_perfumeriabq",
  envioGratis: "Envío gratis en Barranquilla — Perfumes 1.1",
  logo: "/logo-essenza.svg",
} as const;

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
}

export const whatsappUrl = (text?: string) => {
  const base = `https://wa.me/${site.whatsapp}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
};
