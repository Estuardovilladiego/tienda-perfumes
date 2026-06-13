"use client";

import { useCart } from "@/app/providers/CartProvider";
import BestSellers from "@/app/components/home/BestSellers";
import Benefits from "@/app/components/home/Benefits";
import CtaSection from "@/app/components/home/CtaSection";
import FeaturedBrands from "@/app/components/home/FeaturedBrands";
import FeaturedCategories from "@/app/components/home/FeaturedCategories";
import HeroSection from "@/app/components/home/HeroSection";
import PromoBanner from "@/app/components/home/PromoBanner";
import Testimonials from "@/app/components/home/Testimonials";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";

import type { ProductoCatalogo } from "../types/producto";

type Props = {
  destacados: ProductoCatalogo[];
  mostrarAvisoDemo?: boolean;
};

export default function HomeClient({
  destacados,
  mostrarAvisoDemo = false,
}: Props) {
  const { cantidad, subtotal, abrirCarrito } = useCart();

  return (
    <main className="min-h-screen bg-white text-foreground">
      {mostrarAvisoDemo && (
        <div className="border-b border-amber-200/80 bg-amber-50/90 px-4 py-2.5 text-center text-xs text-amber-950">
          Modo demo — catálogo en archivo (sin MySQL)
        </div>
      )}

      <Navbar
        abrirCarrito={abrirCarrito}
        cantidad={cantidad}
        subtotal={subtotal}
      />

      <HeroSection />
      <FeaturedCategories />
      <BestSellers productos={destacados} />
      <PromoBanner />
      <Benefits />
      <FeaturedBrands />
      <Testimonials />
      <CtaSection />
      <Footer />
    </main>
  );
}
