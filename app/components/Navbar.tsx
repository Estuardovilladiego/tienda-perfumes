"use client";

import { ChevronDown, Menu, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import SocialLinks from "@/app/components/SocialLinks";
import { CATEGORIAS } from "@/lib/categorias";
import { formatPrecioCOP } from "@/lib/format-precio";
import { site } from "@/lib/site";

type Props = {
  abrirCarrito: () => void;
  cantidad: number;
  subtotal: number;
};

const enlaces = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/categorias", label: "Categorías" },
  { href: "/#contacto", label: "Contacto" },
];

type CategoriaNav = {
  nombre: string;
  slug: string;
};

function NavPerfumesDropdown({
  categorias,
  onNavigate,
}: {
  categorias: CategoriaNav[];
  onNavigate?: () => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.12em] transition hover:text-gold"
        aria-expanded={abierto}
        aria-haspopup="true"
      >
        Perfumes
        <ChevronDown
          size={14}
          className={`transition ${abierto ? "rotate-180" : ""}`}
        />
      </button>
      {abierto && (
        <div className="absolute left-0 top-full z-50 mt-2 min-w-[160px] border border-zinc-100 bg-white py-2 shadow-lg">
          {categorias.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categorias/${cat.slug}`}
              onClick={() => {
                setAbierto(false);
                onNavigate?.();
              }}
              className="block px-4 py-2.5 text-sm text-zinc-600 transition hover:bg-zinc-50 hover:text-foreground"
            >
              {cat.nombre}
            </Link>
          ))}
          <Link
            href="/categorias"
            onClick={() => {
              setAbierto(false);
              onNavigate?.();
            }}
            className="block border-t border-zinc-100 px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-zinc-500 transition hover:text-gold"
          >
            Ver todas
          </Link>
        </div>
      )}
    </div>
  );
}

export default function Navbar({ abrirCarrito, cantidad, subtotal }: Props) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [categorias, setCategorias] = useState<CategoriaNav[]>(
    CATEGORIAS.map((cat) => ({ nombre: cat.nombre, slug: cat.slug }))
  );

  useEffect(() => {
    document.body.style.overflow = menuAbierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAbierto]);

  useEffect(() => {
    let cancelado = false;

    async function cargarCategorias() {
      try {
        const response = await fetch("/api/categorias");
        const json = await response.json();
        if (!cancelado && json?.ok && Array.isArray(json.data?.categorias)) {
          setCategorias(
            json.data.categorias.map((cat: CategoriaNav) => ({
              nombre: cat.nombre,
              slug: cat.slug,
            }))
          );
        }
      } catch {
        // Mantiene las categorias base si la API no esta disponible.
      }
    }

    cargarCategorias();
    return () => {
      cancelado = true;
    };
  }, []);

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm pt-[env(safe-area-inset-top,0px)]">
      <div className="bg-black text-white">
        <div className="section-container flex items-center justify-between gap-3 py-2">
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="banner-premium">
              <span>{site.envioGratis}</span>
              <span>{site.envioGratis}</span>
            </div>
          </div>
          <SocialLinks variant="light" iconSize={20} className="hidden shrink-0 min-[380px]:flex" />
        </div>
      </div>

      <div className="border-b border-zinc-200 bg-white">
        <div className="section-container flex items-center justify-between gap-2 py-3 sm:gap-4 sm:py-4">
          <Link href="/" className="flex min-w-0 shrink items-center gap-2 sm:gap-3">
            <Image
              src={site.logo}
              alt={site.nombreCompleto}
              width={56}
              height={56}
              className="h-11 w-11 object-contain sm:h-14 sm:w-14"
              priority
            />
            <div className="hidden min-w-0 leading-none sm:block">
              <span className="block truncate text-base font-semibold tracking-[0.16em] uppercase sm:text-lg lg:text-xl">
                {site.nombre}
              </span>
              <span className="mt-1 block truncate text-[8px] tracking-[0.28em] uppercase text-muted lg:text-[9px] lg:tracking-[0.45em]">
                {site.tagline}
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-4 xl:flex">
            <Link
              href="/"
              className="text-[11px] font-medium uppercase tracking-[0.12em] transition hover:text-gold"
            >
              Inicio
            </Link>
            <NavPerfumesDropdown categorias={categorias} />
            {enlaces.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] font-medium uppercase tracking-[0.12em] transition hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
            <button
              type="button"
              onClick={abrirCarrito}
              aria-label="Abrir carrito"
              className="flex items-center gap-2 rounded-full p-2 transition hover:bg-zinc-100 sm:pr-3"
            >
              <span className="relative">
                <ShoppingBag size={22} strokeWidth={1.5} />
                {cantidad > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white">
                    {cantidad > 9 ? "9+" : cantidad}
                  </span>
                )}
              </span>
              <span className="hidden text-xs font-medium sm:inline">
                $ {formatPrecioCOP(subtotal)}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMenuAbierto(!menuAbierto)}
              aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
              className="rounded-full p-2 xl:hidden"
            >
              {menuAbierto ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 xl:hidden ${
          menuAbierto ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={cerrarMenu}
      />
      <div
        className={`nav-mobile-drawer fixed right-0 top-0 z-50 flex h-[100dvh] w-[min(94vw,340px)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out xl:hidden ${
          menuAbierto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <Image
            src={site.logo}
            alt={site.nombreCompleto}
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <button type="button" onClick={cerrarMenu} aria-label="Cerrar">
            <X size={22} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <Link
            href="/"
            onClick={cerrarMenu}
            className="block border-b border-zinc-100 py-3.5 text-xs font-medium uppercase tracking-[0.15em]"
          >
            Inicio
          </Link>
          <p className="mb-2 mt-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
            Perfumes
          </p>
          {categorias.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categorias/${cat.slug}`}
              onClick={cerrarMenu}
              className="block border-b border-zinc-100 py-3 text-sm text-zinc-700"
            >
              {cat.nombre}
            </Link>
          ))}
          <Link
            href="/categorias"
            onClick={cerrarMenu}
            className="block py-3 text-xs font-medium uppercase tracking-wider text-zinc-500"
          >
            Todas las categorías
          </Link>
          <div className="my-3 border-t border-zinc-200" />
          {enlaces.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={cerrarMenu}
              className="block border-b border-zinc-100 py-3.5 text-xs font-medium uppercase tracking-[0.15em]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="border-t p-4">
          <SocialLinks variant="dark" iconSize={22} />
        </div>
      </div>
    </header>
  );
}
