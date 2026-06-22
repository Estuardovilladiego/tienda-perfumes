import { site } from "@/lib/site";

export const TITULAR_CUENTAS_PAGO = "Frank Junior Rojano Garzon";

/** Nombre del titular de Nequi, Daviplata, Bancolombia, Falabella, etc. */
export function nombreTitularCuentas() {
  const nombre =
    process.env.NEXT_PUBLIC_PAGO_TITULAR_NOMBRE?.trim() ||
    process.env.NEXT_PUBLIC_PAGO_TITULAR?.trim();
  return nombre || TITULAR_CUENTAS_PAGO;
}

export type MetodoPagoId =
  | "nequi"
  | "daviplata"
  | "llaves"
  | "bancolombia"
  | "falabella"
  | "sistecredito"
  | "addi";

export type MetodoPagoTipo = "transferencia" | "credito";

export type MetodoPago = {
  id: MetodoPagoId;
  label: string;
  descripcion: string;
  tipo: MetodoPagoTipo;
  accent: string;
};

/** Cuentas configurables vía .env (NEXT_PUBLIC_* visible en checkout) */
export const cuentasPago = {
  nequi: process.env.NEXT_PUBLIC_PAGO_NEQUI || "3012936439",
  daviplata: process.env.NEXT_PUBLIC_PAGO_DAVIPLATA || "3012936439",
  llaves: {
    alias: process.env.NEXT_PUBLIC_PAGO_LLAVES_ALIAS || "@bffr808934",
    celular: process.env.NEXT_PUBLIC_PAGO_LLAVES_CELULAR || "3012936439",
  },
  bancolombia: {
    numero: process.env.NEXT_PUBLIC_PAGO_BANCOLOMBIA_CUENTA || "48664039535",
    tipo: process.env.NEXT_PUBLIC_PAGO_BANCOLOMBIA_TIPO || "Ahorros",
    get titular() {
      return nombreTitularCuentas();
    },
  },
  falabella: {
    numero: process.env.NEXT_PUBLIC_PAGO_FALABELLA_CUENTA || "111820585281",
    get titular() {
      return nombreTitularCuentas();
    },
  },
  sistecredito: {
    comercio: process.env.NEXT_PUBLIC_PAGO_SISTECREDITO_COMERCIO || site.nombre,
  },
  addi: {
    comercio: process.env.NEXT_PUBLIC_PAGO_ADDI_COMERCIO || site.nombre,
  },
} as const;

function fmtCelular(numero: string) {
  const d = numero.replace(/\D/g, "");
  if (d.length === 10) return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
  return numero;
}

function descripcionMetodo(id: MetodoPagoId): string {
  const c = cuentasPago;
  switch (id) {
    case "nequi":
      return `Pago al Nequi ${fmtCelular(c.nequi)}`;
    case "daviplata":
      return `Transferencia al ${fmtCelular(c.daviplata)}`;
    case "llaves":
      return `Llave ${c.llaves.alias} o al ${fmtCelular(c.llaves.celular)}`;
    case "bancolombia":
      return `Transferencia a cuenta ${c.bancolombia.tipo.toLowerCase()} Bancolombia`;
    case "falabella":
      return "Transferencia a cuenta Falabella";
    case "sistecredito":
      return "Crédito directo — te guiamos por WhatsApp";
    case "addi":
      return "Compra a cuotas — coordinación por WhatsApp";
    default:
      return "Pago por transferencia";
  }
}

export const metodosPago: MetodoPago[] = [
  {
    id: "nequi",
    label: "Nequi",
    descripcion: descripcionMetodo("nequi"),
    tipo: "transferencia",
    accent: "border-[#6B21A8]/30 bg-[#6B21A8]/5",
  },
  {
    id: "daviplata",
    label: "Daviplata",
    descripcion: descripcionMetodo("daviplata"),
    tipo: "transferencia",
    accent: "border-[#E11D48]/30 bg-[#E11D48]/5",
  },
  {
    id: "llaves",
    label: "Llaves (Bre-B)",
    descripcion: descripcionMetodo("llaves"),
    tipo: "transferencia",
    accent: "border-sky-500/30 bg-sky-500/5",
  },
  {
    id: "bancolombia",
    label: "Bancolombia",
    descripcion: descripcionMetodo("bancolombia"),
    tipo: "transferencia",
    accent: "border-[#FACC15]/40 bg-[#FACC15]/10",
  },
  {
    id: "falabella",
    label: "Falabella",
    descripcion: descripcionMetodo("falabella"),
    tipo: "transferencia",
    accent: "border-green-600/30 bg-green-600/5",
  },
  {
    id: "sistecredito",
    label: "Sistecredito",
    descripcion: descripcionMetodo("sistecredito"),
    tipo: "credito",
    accent: "border-gold/40 bg-gold/10",
  },
  {
    id: "addi",
    label: "Addi",
    descripcion: descripcionMetodo("addi"),
    tipo: "credito",
    accent: "border-emerald-500/30 bg-emerald-500/5",
  },
];

export const metodosPagoLabels = metodosPago.map((m) => m.label);

export function getMetodoPago(id: string) {
  return metodosPago.find((m) => m.id === id);
}

export function esMetodoPagoValido(id: string) {
  return metodosPago.some((m) => m.id === id);
}

export function labelMetodoPago(id: string) {
  return getMetodoPago(id)?.label ?? id;
}

export function idMetodoPagoDesdeLabel(label: string): MetodoPagoId | undefined {
  const normalizado = label.trim().toLowerCase();
  return metodosPago.find(
    (m) =>
      m.id === normalizado ||
      m.label.toLowerCase() === normalizado ||
      m.label.toLowerCase().includes(normalizado)
  )?.id;
}

/** Datos de cuenta visibles según el método elegido. */
export function cuentaMetodoPago(metodoId: MetodoPagoId): LineaCuentaPago[] {
  const c = cuentasPago;

  switch (metodoId) {
    case "nequi":
      return [
        { label: "Nequi", valor: fmtCelular(c.nequi) },
        { label: "Titular", valor: nombreTitularCuentas() },
      ];
    case "daviplata":
      return [
        { label: "Daviplata", valor: fmtCelular(c.daviplata) },
        { label: "Titular", valor: nombreTitularCuentas() },
      ];
    case "llaves":
      return [
        { label: "Llave Bre-B", valor: c.llaves.alias },
        { label: "Celular", valor: fmtCelular(c.llaves.celular) },
        { label: "Titular", valor: nombreTitularCuentas() },
      ];
    case "bancolombia":
      return [
        { label: "Bancolombia", valor: c.bancolombia.numero },
        { label: "Tipo de cuenta", valor: c.bancolombia.tipo },
        { label: "Titular", valor: c.bancolombia.titular },
      ];
    case "falabella":
      return [
        { label: "Falabella", valor: c.falabella.numero },
        { label: "Titular", valor: c.falabella.titular },
      ];
    case "sistecredito":
      return [{ label: "Comercio", valor: c.sistecredito.comercio }];
    case "addi":
      return [{ label: "Comercio", valor: c.addi.comercio }];
    default:
      return [];
  }
}

export function instruccionesPago(metodoId: MetodoPagoId, total: number, numeroPedido: string) {
  const totalFmt = `$${total.toLocaleString("es-CO")}`;
  const ref = `Pedido ${numeroPedido}`;

  switch (metodoId) {
    case "nequi":
      return [
        `Envía ${totalFmt} al Nequi ${fmtCelular(cuentasPago.nequi)}.`,
        `Titular: ${nombreTitularCuentas()}.`,
        `Llave Bre-B alternativa: ${cuentasPago.llaves.alias}.`,
        `Referencia: ${ref}.`,
        "Envía el comprobante por WhatsApp.",
      ];
    case "daviplata":
      return [
        `Envía ${totalFmt} al Daviplata ${fmtCelular(cuentasPago.daviplata)}.`,
        `Titular: ${nombreTitularCuentas()}.`,
        `Referencia: ${ref}.`,
        "Comparte el comprobante por WhatsApp.",
      ];
    case "llaves":
      return [
        `Paga ${totalFmt} con Llaves (Bre-B).`,
        `Llave: ${cuentasPago.llaves.alias} · Celular: ${fmtCelular(cuentasPago.llaves.celular)}.`,
        `Titular: ${nombreTitularCuentas()}.`,
        `Referencia: ${ref}.`,
        "Envía captura del pago por WhatsApp.",
      ];
    case "bancolombia": {
      const { numero, tipo, titular } = cuentasPago.bancolombia;
      return [
        `Transfiere ${totalFmt} a cuenta ${tipo} Bancolombia ${numero}.`,
        `Titular: ${titular}.`,
        `Referencia: ${ref}.`,
        "Envía el comprobante por WhatsApp.",
      ];
    }
    case "falabella": {
      const { numero, titular } = cuentasPago.falabella;
      return [
        `Transfiere ${totalFmt} a cuenta Falabella ${numero}.`,
        `Titular: ${titular}.`,
        `Referencia: ${ref}.`,
        "Envía el comprobante por WhatsApp.",
      ];
    }
    case "sistecredito":
      return [
        `Crédito Sistecredito por ${totalFmt} (incluye recargo de financiación).`,
        "Te guiamos por WhatsApp con el link y los pasos para aprobar el crédito.",
        `Indica tu pedido: ${ref}.`,
      ];
    case "addi":
      return [
        `Pago a cuotas con Addi — total ${totalFmt} (incluye recargo de financiación).`,
        "Te guiamos por WhatsApp con el enlace e instrucciones de Addi.",
        `Referencia del pedido: ${ref}.`,
      ];
    default:
      return [`Realiza el pago de ${totalFmt} y confirma por WhatsApp.`];
  }
}

export function requiereReferenciaPago(_metodoId: MetodoPagoId) {
  void _metodoId;
  return false;
}

export const titularPago = {
  get nombre() {
    return nombreTitularCuentas();
  },
  cedula: process.env.NEXT_PUBLIC_PAGO_CEDULA || "",
};

export type LineaCuentaPago = { label: string; valor: string };

export function lineasCuentasPago(): LineaCuentaPago[] {
  const c = cuentasPago;
  return [
    {
      label: `Bancolombia - ${c.bancolombia.tipo}`,
      valor: c.bancolombia.numero,
    },
    { label: "Falabella", valor: c.falabella.numero },
    { label: "Nequi", valor: fmtCelular(c.nequi) },
    { label: "Daviplata", valor: fmtCelular(c.daviplata) },
    { label: "Llave Bre-B", valor: c.llaves.alias },
    { label: "WhatsApp", valor: fmtCelular(site.whatsappDisplay) },
  ].filter((linea) => linea.valor.trim());
}

/** Número corto para mostrar al cliente (ej. 25716 o ESS-20260609-ABC) */
export function numeroPedidoVisible(numero: string, pedidoId?: number) {
  if (pedidoId) return String(pedidoId);
  const soloDigitos = numero.replace(/\D/g, "");
  if (soloDigitos.length <= 8) return soloDigitos || numero;
  return numero.replace(/^ESS-/, "").replace(/-/g, "");
}

export const resumenCuentasPago = lineasCuentasPago().map(
  (linea) => `${linea.label}: ${linea.valor}`
);
