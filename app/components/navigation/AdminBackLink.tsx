import { ChevronLeft } from "lucide-react";

type Props = {
  label: string;
  onClick: () => void;
  className?: string;
};

/** Retorno en un clic dentro del panel admin (formularios, detalle). */
export default function AdminBackLink({ label, onClick, className = "" }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`admin-back-link ${className}`.trim()}
    >
      <ChevronLeft size={16} strokeWidth={1.5} aria-hidden />
      <span>{label}</span>
    </button>
  );
}
