import type { CategoriaRef } from "@/app/types/producto";
import { puedeVenderDecant, stockParaVenta } from "@/lib/decants";
import { etiquetaStock, stockDisponible } from "@/lib/stock-display";

type Props = {
  stock: number | undefined | null;
  categorias?: CategoriaRef[];
  compact?: boolean;
  className?: string;
};

export default function StockIndicator({ stock: raw, categorias, compact, className = "" }: Props) {
  const stockFrasco = stockDisponible(raw);
  const enDecants = puedeVenderDecant({ categorias });
  const stockVenta = enDecants
    ? stockParaVenta({ stock: raw, categorias })
    : stockFrasco;

  const label = enDecants
    ? stockFrasco <= 0
      ? "Decant disponible"
      : `Decant · ${etiquetaStock(stockFrasco).toLowerCase()}`
    : etiquetaStock(stockVenta);

  const tone =
    stockVenta === 0
      ? "bg-red-50 text-red-700 ring-red-100"
      : enDecants && stockFrasco <= 0
        ? "bg-[#faf6ef] text-[#8b6914] ring-[#e8ded4]"
        : stockVenta <= 5
          ? "bg-amber-50 text-amber-900 ring-amber-100"
          : "bg-emerald-50 text-emerald-800 ring-emerald-100";

  const dot =
    stockVenta === 0
      ? "bg-red-500"
      : enDecants && stockFrasco <= 0
        ? "bg-[#b8956a]"
        : stockVenta <= 5
          ? "bg-amber-500"
          : "bg-emerald-500";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full ring-1 ${tone} ${
        compact ? "px-2.5 py-1 text-[10px]" : "px-3 py-1.5 text-xs"
      } font-medium ${className}`}
      role="status"
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} aria-hidden />
      {label}
    </span>
  );
}
