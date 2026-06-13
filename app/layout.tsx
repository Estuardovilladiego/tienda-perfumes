import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";

import JsonLd from "@/app/components/seo/JsonLd";
import StoreChrome from "@/app/components/StoreChrome";
import { jsonLdOrganization } from "@/lib/seo";
import { getSiteUrl, site } from "@/lib/site";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-montserrat",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Essenza Perfumería | Perfumes 1.1 premium",
    template: "%s | Essenza Perfumería",
  },
  description:
    "Descubre tu esencia. Perfumes 1.1 para hombre, mujer, unisex y árabes. Envíos nacionales desde Barranquilla, Colombia.",
  keywords: [
    "perfumes",
    "perfumería",
    "Barranquilla",
    "fragancias 1.1",
    "Lattafa",
    "árabes",
  ],
  openGraph: {
    title: site.nombreCompleto,
    description:
      "Perfumes 1.1 para quienes desean destacar. Envíos a toda Colombia.",
    locale: "es_CO",
    type: "website",
    siteName: site.nombreCompleto,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={montserrat.variable} data-scroll-behavior="smooth">
      <body
        className={`${montserrat.className} min-h-dvh font-sans antialiased touch-manipulation`}
      >
        <JsonLd data={jsonLdOrganization()} />
        <StoreChrome>{children}</StoreChrome>
      </body>
    </html>
  );
}
