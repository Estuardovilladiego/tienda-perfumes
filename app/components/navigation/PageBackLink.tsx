import { ChevronLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  href: string;
  label: string;
  className?: string;
};

/** Enlace de retorno contextual — un clic, destino explícito. */
export default function PageBackLink({ href, label, className = "" }: Props) {
  return (
    <Link href={href} className={`page-back-link ${className}`.trim()}>
      <ChevronLeft size={16} strokeWidth={1.5} aria-hidden />
      <span>Volver a {label}</span>
    </Link>
  );
}
