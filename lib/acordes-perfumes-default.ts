import type { NotasOlfativas } from "@/lib/notas-perfumes-default";

export type AcordePrincipal = {
  nombre: string;
  valor: number;
  color: string;
};

/** Paleta alineada con Fragrantica / referencia visual Essenza. */
export const COLORES_ACORDES: Record<string, string> = {
  "fresco especiado": "#2d8a4e",
  ámbar: "#b5651d",
  ambar: "#b5651d",
  cítrico: "#e8b923",
  citrico: "#e8b923",
  aromático: "#3a8fb7",
  aromatico: "#3a8fb7",
  almizclado: "#9b8ab8",
  amaderado: "#6b4423",
  herbal: "#7cb87c",
  lavanda: "#9b7bb8",
  "cálido especiado": "#d4745c",
  "calido especiado": "#d4745c",
  floral: "#e8a0bf",
  gourmand: "#c9844a",
  afrutado: "#e07a5f",
  acuático: "#5ba4c9",
  acuatico: "#5ba4c9",
  oriental: "#8b4513",
  cuero: "#4a3728",
  ahumado: "#5c5c5c",
};

const acordesPorSlug: Record<string, AcordePrincipal[]> = {
  "bleu-de-chanel": [
    { nombre: "fresco especiado", valor: 100, color: COLORES_ACORDES["fresco especiado"] },
    { nombre: "ámbar", valor: 85, color: COLORES_ACORDES.ámbar },
    { nombre: "cítrico", valor: 78, color: COLORES_ACORDES.cítrico },
    { nombre: "aromático", valor: 72, color: COLORES_ACORDES.aromático },
    { nombre: "almizclado", valor: 65, color: COLORES_ACORDES.almizclado },
    { nombre: "amaderado", valor: 58, color: COLORES_ACORDES.amaderado },
    { nombre: "herbal", valor: 50, color: COLORES_ACORDES.herbal },
    { nombre: "lavanda", valor: 42, color: COLORES_ACORDES.lavanda },
    { nombre: "cálido especiado", valor: 35, color: COLORES_ACORDES["cálido especiado"] },
  ],
  "dior-sauvage": [
    { nombre: "fresco especiado", valor: 100, color: COLORES_ACORDES["fresco especiado"] },
    { nombre: "aromático", valor: 88, color: COLORES_ACORDES.aromático },
    { nombre: "cítrico", valor: 82, color: COLORES_ACORDES.cítrico },
    { nombre: "almizclado", valor: 70, color: COLORES_ACORDES.almizclado },
    { nombre: "lavanda", valor: 62, color: COLORES_ACORDES.lavanda },
    { nombre: "amaderado", valor: 55, color: COLORES_ACORDES.amaderado },
    { nombre: "ámbar", valor: 48, color: COLORES_ACORDES.ámbar },
  ],
  khamrah: [
    { nombre: "cálido especiado", valor: 100, color: COLORES_ACORDES["cálido especiado"] },
    { nombre: "gourmand", valor: 92, color: COLORES_ACORDES.gourmand },
    { nombre: "ámbar", valor: 85, color: COLORES_ACORDES.ámbar },
    { nombre: "amaderado", valor: 72, color: COLORES_ACORDES.amaderado },
    { nombre: "almizclado", valor: 60, color: COLORES_ACORDES.almizclado },
  ],
  "creed-aventus": [
    { nombre: "afrutado", valor: 100, color: COLORES_ACORDES.afrutado },
    { nombre: "cítrico", valor: 88, color: COLORES_ACORDES.cítrico },
    { nombre: "amaderado", valor: 75, color: COLORES_ACORDES.amaderado },
    { nombre: "ahumado", valor: 68, color: COLORES_ACORDES.ahumado },
    { nombre: "almizclado", valor: 55, color: COLORES_ACORDES.almizclado },
  ],
  "good-girl": [
    { nombre: "gourmand", valor: 100, color: COLORES_ACORDES.gourmand },
    { nombre: "floral", valor: 90, color: COLORES_ACORDES.floral },
    { nombre: "almizclado", valor: 78, color: COLORES_ACORDES.almizclado },
    { nombre: "ámbar", valor: 65, color: COLORES_ACORDES.ámbar },
    { nombre: "amaderado", valor: 52, color: COLORES_ACORDES.amaderado },
  ],
  "erba-pura": [
    { nombre: "cítrico", valor: 100, color: COLORES_ACORDES.cítrico },
    { nombre: "afrutado", valor: 88, color: COLORES_ACORDES.afrutado },
    { nombre: "almizclado", valor: 72, color: COLORES_ACORDES.almizclado },
    { nombre: "ámbar", valor: 58, color: COLORES_ACORDES.ámbar },
  ],
};

const acordesGenericos: AcordePrincipal[] = [
  { nombre: "aromático", valor: 100, color: COLORES_ACORDES.aromático },
  { nombre: "amaderado", valor: 82, color: COLORES_ACORDES.amaderado },
  { nombre: "almizclado", valor: 70, color: COLORES_ACORDES.almizclado },
  { nombre: "ámbar", valor: 58, color: COLORES_ACORDES.ámbar },
  { nombre: "cítrico", valor: 45, color: COLORES_ACORDES.cítrico },
];

function colorAcorde(nombre: string) {
  const key = nombre.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  return COLORES_ACORDES[nombre.toLowerCase()] ?? COLORES_ACORDES[key] ?? "#8b7355";
}

function inferirDesdeNotas(notas: NotasOlfativas): AcordePrincipal[] {
  const texto = `${notas.salida} ${notas.corazon} ${notas.fondo}`.toLowerCase();
  const candidatos: { nombre: string; peso: number }[] = [];

  const reglas: { nombre: string; patrones: RegExp[]; peso: number }[] = [
    { nombre: "cítrico", patrones: [/bergamota/, /limón/, /limon/, /mandarina/, /naranja/, /pomelo/], peso: 90 },
    { nombre: "floral", patrones: [/jazmín/, /jazmin/, /rosa/, /tuberosa/, /iris/, /lavanda/], peso: 85 },
    { nombre: "gourmand", patrones: [/vainilla/, /praliné/, /praline/, /cacao/, /tonka/, /café/, /cafe/], peso: 88 },
    { nombre: "amaderado", patrones: [/cedro/, /sándalo/, /sandalo/, /vetiver/, /pachulí/, /pachuli/, /oud/], peso: 80 },
    { nombre: "fresco especiado", patrones: [/pimienta/, /cardamomo/, /canela/, /jengibre/], peso: 82 },
    { nombre: "almizclado", patrones: [/almizcle/], peso: 75 },
    { nombre: "ámbar", patrones: [/ámbar/, /ambar/, /amber/], peso: 72 },
    { nombre: "acuático", patrones: [/marino/, /acuát/, /acuat/], peso: 78 },
    { nombre: "ahumado", patrones: [/incienso/, /tabaco/, /ahum/], peso: 70 },
    { nombre: "afrutado", patrones: [/manzana/, /pera/, /piña/, /pina/, /frut/], peso: 76 },
  ];

  for (const regla of reglas) {
    if (regla.patrones.some((p) => p.test(texto))) {
      candidatos.push({ nombre: regla.nombre, peso: regla.peso });
    }
  }

  if (!candidatos.length) return acordesGenericos;

  candidatos.sort((a, b) => b.peso - a.peso);
  const max = candidatos[0]?.peso ?? 100;

  return candidatos.slice(0, 9).map((c, i) => ({
    nombre: c.nombre,
    valor: Math.round(max - i * (max / 10)),
    color: colorAcorde(c.nombre),
  }));
}

function parseJsonAcordes(value: unknown): AcordePrincipal[] | null {
  if (!Array.isArray(value) || !value.length) return null;
  const parsed = value
    .filter(
      (item): item is AcordePrincipal =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as AcordePrincipal).nombre === "string" &&
        typeof (item as AcordePrincipal).valor === "number"
    )
    .map((item) => ({
      nombre: item.nombre,
      valor: item.valor,
      color: item.color || colorAcorde(item.nombre),
    }));
  return parsed.length ? parsed : null;
}

export function acordesPorDefecto(slug: string, notas?: NotasOlfativas | null) {
  if (acordesPorSlug[slug]) return acordesPorSlug[slug];
  if (notas) return inferirDesdeNotas(notas);
  return acordesGenericos;
}

export function resolverAcordes(
  baseSlug: string,
  db: { acordesPrincipales?: unknown },
  notas?: NotasOlfativas | null
): AcordePrincipal[] {
  const desdeDb = parseJsonAcordes(db.acordesPrincipales);
  if (desdeDb) return desdeDb;
  return acordesPorDefecto(baseSlug, notas);
}

export function acordesParaJson(acordes: AcordePrincipal[]) {
  return acordes.map((a) => ({
    nombre: a.nombre,
    valor: a.valor,
    color: a.color,
  }));
}
