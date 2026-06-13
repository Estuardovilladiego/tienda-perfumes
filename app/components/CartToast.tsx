"use client";

type Props = {
  visible: boolean;
  message?: string;
  variant?: "success" | "error";
};

export default function CartToast({
  visible,
  message = "Producto agregado al carrito",
  variant = "success",
}: Props) {
  const isError = variant === "error";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`cart-toast fixed left-1/2 z-[60] max-w-[min(92vw,360px)] -translate-x-1/2 rounded-full border px-5 py-3 text-center text-sm font-medium tracking-wide shadow-[0_12px_40px_rgba(0,0,0,0.18)] transition-all duration-300 ease-out sm:bottom-8 ${
        isError
          ? "border-red-400/30 bg-red-950 text-red-100"
          : "border-emerald-400/25 bg-[#1a4d38] text-white"
      } ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      {message}
    </div>
  );
}
