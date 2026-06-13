import SocialLinks from "@/app/components/SocialLinks";

type Props = {
  className?: string;
};

/** Redes Essenza en el modal del producto. */
export default function SocialShare({ className = "" }: Props) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <span className="text-sm font-semibold text-foreground">Síguenos:</span>
      <SocialLinks variant="dark" iconSize={18} />
    </div>
  );
}
