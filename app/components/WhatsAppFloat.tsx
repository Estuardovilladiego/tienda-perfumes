import Link from "next/link";

import { whatsappUrl } from "@/lib/site";

const WHATSAPP_MESSAGE = "Hola, estoy interesado en los perfumes de ESSENZA.";
const WHATSAPP_URL = whatsappUrl(WHATSAPP_MESSAGE);

export default function WhatsAppFloat() {
  return (
    <div className="whatsapp-float fixed z-30">
      <Link
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chatear por WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_rgba(15,23,42,0.28)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_16px_34px_rgba(15,23,42,0.34)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/70 active:scale-95"
      >
        <svg
          viewBox="0 0 32 32"
          aria-hidden="true"
          className="h-7 w-7"
          fill="currentColor"
        >
          <path d="M19.11 17.48c-.27-.14-1.6-.79-1.84-.88-.25-.09-.43-.14-.62.14-.18.27-.71.88-.87 1.07-.16.18-.33.2-.6.07-.27-.14-1.16-.43-2.2-1.37-.81-.73-1.36-1.63-1.52-1.9-.16-.27-.02-.42.12-.56.12-.12.27-.33.4-.49.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.06-.22-.53-.45-.46-.62-.47l-.52-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.28s.98 2.64 1.11 2.82c.14.18 1.92 2.93 4.66 4.11.65.28 1.15.44 1.54.57.65.21 1.24.18 1.71.11.52-.08 1.6-.65 1.83-1.28.22-.63.22-1.17.16-1.28-.07-.11-.25-.18-.52-.32Z" />
          <path d="M16 3.2c-7.05 0-12.8 5.73-12.8 12.78 0 2.26.6 4.47 1.73 6.41L3.2 28.8l6.58-1.72a12.86 12.86 0 0 0 6.22 1.59h.01c7.05 0 12.79-5.73 12.79-12.79 0-3.42-1.34-6.64-3.76-9.06A12.7 12.7 0 0 0 16 3.2Zm0 23.3h-.01a10.7 10.7 0 0 1-5.46-1.5l-.39-.23-3.9 1.02 1.04-3.8-.25-.39a10.65 10.65 0 0 1-1.64-5.7c0-5.9 4.8-10.7 10.71-10.7 2.86 0 5.55 1.11 7.57 3.13a10.64 10.64 0 0 1 3.13 7.57c0 5.9-4.8 10.7-10.7 10.7Z" />
        </svg>

        <span className="pointer-events-none absolute right-full mr-3 hidden rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 opacity-0 shadow-md transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 md:block md:translate-x-1">
          ¿Necesitas ayuda?
        </span>
      </Link>
    </div>
  );
}
