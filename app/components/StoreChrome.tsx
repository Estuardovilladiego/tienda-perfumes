"use client";

import { usePathname } from "next/navigation";

import WhatsAppFloat from "@/app/components/WhatsAppFloat";
import { CartProvider } from "@/app/providers/CartProvider";

export default function StoreChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return children;
  }

  return (
    <CartProvider>
      {children}
      <WhatsAppFloat />
    </CartProvider>
  );
}
