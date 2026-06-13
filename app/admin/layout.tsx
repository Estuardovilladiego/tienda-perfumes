import Link from "next/link";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell min-h-dvh bg-background text-foreground">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:text-accent"
      >
        Ir al contenido
      </a>
      {children}
      <footer className="border-t border-border py-4 text-center text-xs text-muted">
        <Link href="/" className="transition hover:text-gold">
          ← Volver a la tienda Essenza
        </Link>
      </footer>
    </div>
  );
}
