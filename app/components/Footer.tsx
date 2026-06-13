import {
  CreditCard,
  FileText,
  HelpCircle,
  Mail,
  MapPin,
  Shield,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import FooterNewsletter from "@/app/components/footer/FooterNewsletter";
import FooterSocial from "@/app/components/footer/FooterSocial";
import { CATEGORIAS } from "@/lib/categorias";
import { paymentMethods } from "@/lib/home-data";
import { site, whatsappUrl } from "@/lib/site";

const linkHover =
  "inline-flex items-center gap-2 text-sm text-zinc-400 transition-all duration-300 hover:translate-x-0.5 hover:text-[#d4bc94]";

const enlacesCategorias = [
  ...CATEGORIAS.map((c) => ({
    href: `/categorias/${c.slug}`,
    label: c.nombre,
  })),
  { href: "/catalogo", label: "Catálogo" },
];

const enlacesAtencion = [
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes", icon: HelpCircle },
  { href: "/privacidad", label: "Política de privacidad", icon: Shield },
  { href: "/terminos", label: "Términos y condiciones", icon: FileText },
  { href: "/metodos-pago", label: "Métodos de pago", icon: CreditCard },
];

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#d4bc94]">
      {children}
    </h3>
  );
}

function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 shrink-0 ${className ?? ""}`}
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 shrink-0 ${className ?? ""}`}
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845a1.44 1.44 0 11-2.881 0 1.44 1.44 0 012.881 0z" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contacto"
      className="scroll-mt-32 relative overflow-hidden bg-[#0a0a0a] text-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(184,149,108,0.08)_0%,transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_100%,rgba(212,188,148,0.05)_0%,transparent_45%)]" />

      <div className="section-container relative z-10 py-14 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* Columna 1 — Marca */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block transition-opacity hover:opacity-90">
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-[#d4bc94]/10 blur-xl" />
                <Image
                  src={site.logo}
                  alt={site.nombreCompleto}
                  width={80}
                  height={80}
                  className="relative h-20 w-20 object-contain"
                />
              </div>
            </Link>
            <p className="mt-4 text-xl font-light uppercase tracking-[0.22em] text-white">
              {site.nombre.toUpperCase()}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
              Descubre fragancias exclusivas para cada ocasión. Perfumes 1.1
              que reflejan personalidad, elegancia y estilo.
            </p>
            <div className="mt-6">
              <FooterSocial />
            </div>
          </div>

          {/* Columna 2 — Categorías */}
          <div>
            <FooterHeading>Categorías</FooterHeading>
            <ul className="space-y-3">
              {enlacesCategorias.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className={linkHover}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3 — Atención al cliente */}
          <div>
            <FooterHeading>Atención al cliente</FooterHeading>
            <ul className="space-y-3">
              {enlacesAtencion.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={linkHover}>
                    <link.icon
                      size={16}
                      strokeWidth={1.5}
                      className="shrink-0 text-[#b8956c]"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4 — Contacto */}
          <div>
            <FooterHeading>Contacto</FooterHeading>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkHover}
                >
                  <IconWhatsApp className="text-[#25D366]" />
                  <span>
                    <span className="block text-xs text-zinc-500">WhatsApp</span>
                    {site.whatsappDisplay}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkHover}
                >
                  <IconInstagram className="text-[#d4bc94]" />
                  <span>
                    <span className="block text-xs text-zinc-500">Instagram</span>
                    {site.instagramHandle}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className={linkHover}
                >
                  <Mail size={16} className="shrink-0 text-[#d4bc94]" />
                  <span>
                    <span className="block text-xs text-zinc-500">Correo</span>
                    <span className="break-all">{site.email}</span>
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-zinc-400">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#d4bc94]" />
                <span>
                  <span className="block text-xs text-zinc-500">Ubicación</span>
                  {site.ciudad}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Métodos de pago */}
        <div
          id="metodos-pago"
          className="mt-14 scroll-mt-28 border-t border-white/10 pt-12"
        >
          <FooterHeading>Métodos de pago</FooterHeading>
          <div className="flex flex-wrap gap-3">
            {paymentMethods.map((metodo) => (
              <span
                key={metodo}
                className="rounded-xl border border-zinc-700/80 bg-zinc-900/60 px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-200 shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition duration-300 hover:border-[#d4bc94]/40 hover:bg-zinc-800/80 hover:text-[#d4bc94]"
              >
                {metodo}
              </span>
            ))}
          </div>
          <p className="mt-4 max-w-xl text-xs leading-relaxed text-zinc-500">
            Aceptamos pagos electrónicos. Al finalizar tu compra verás las instrucciones según el
            método que elijas.
          </p>
        </div>

        {/* Newsletter */}
        <div className="mt-12">
          <FooterNewsletter />
        </div>
      </div>

      {/* Footer inferior */}
      <div className="relative border-t border-white/10 bg-black/40">
        <div className="section-container flex flex-col items-center justify-between gap-3 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-zinc-500">
            <span className="font-medium uppercase tracking-[0.15em] text-zinc-400">
              {site.nombre.toUpperCase()}
            </span>{" "}
            © {year}. Todos los derechos reservados.
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
            Desarrollado con Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
