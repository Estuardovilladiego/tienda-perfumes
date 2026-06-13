/** Notas olfativas de referencia (se usan si el producto no tiene notas en BD). */
export type NotasOlfativas = {
  salida: string;
  corazon: string;
  fondo: string;
};

const notasPorSlug: Record<string, NotasOlfativas> = {
  "mandarin-sky": {
    salida: "Mandarina, naranja, bergamota",
    corazon: "Jazmín, flor de azahar",
    fondo: "Almizcle, vainilla, ámbar",
  },
  "asad-elixir": {
    salida: "Tabaco, canela, pimienta negra",
    corazon: "Vainilla bourbon, cacao, incienso",
    fondo: "Ámbar, praliné, haba tonka, pachulí",
  },
  "art-of-universe": {
    salida: "Bergamota, mandarina, cardamomo",
    corazon: "Lavanda, geranio, jazmín",
    fondo: "Vetiver, pachulí, ámbar gris, almizcle",
  },
  khamrah: {
    salida: "Canela, nuez moscada, bergamota",
    corazon: "Dátiles, praliné, tuberosa",
    fondo: "Vainilla, haba tonka, amberwood, mirra",
  },
  yara: {
    salida: "Heliotropo, naranja tangerina, orquídea",
    corazon: "Acorde gourmand, flor de azahar",
    fondo: "Vainilla, almizcle, sándalo",
  },
  "creed-aventus": {
    salida: "Piña, bergamota, grosella negra, manzana",
    corazon: "Abedul, rosa, jazmín, pachulí",
    fondo: "Almizcle, musgo de roble, vainilla, ámbar gris",
  },
  "good-girl": {
    salida: "Almendra, café, limón, bergamota",
    corazon: "Tuberosa, jazmín sambac, rosa bulgara, orquídea",
    fondo: "Vainilla, haba tonka, cacao, sándalo, cedro",
  },
  "odissey-aqua": {
    salida: "Notas marinas, limón, naranja, bergamota",
    corazon: "Lavanda, salvia, jazmín, violeta",
    fondo: "Almizcle, ámbar gris, cedro, pachulí",
  },
  "shaheen-gold": {
    salida: "Azafrán, jazmín, rosa",
    corazon: "Oud, ámbar, madera de agar",
    fondo: "Almizcle, pachulí, vainilla, resinas",
  },
  "hawas-ice": {
    salida: "Manzana, bergamota, limón, canela",
    corazon: "Cardamomo, lavanda, ciruela",
    fondo: "Almizcle, ámbar, vetiver, pachulí",
  },
  "ariana-cloud": {
    salida: "Lavanda, pera, bergamota",
    corazon: "Crema de coco, praliné, orquídea vanillada",
    fondo: "Almizcle, maderas, cachemira",
  },
  "stronger-with-you": {
    salida: "Cardamomo, pimienta rosa, violeta, salvia",
    corazon: "Castaña glaciada, canela, lavanda",
    fondo: "Vainilla, ámbar, cedro, haba tonka",
  },
  "born-in-roma-intense": {
    salida: "Vainilla bourbon, lavanda, jengibre",
    corazon: "Jazmín, salvia esclarea",
    fondo: "Vainilla absoluta, haba tonka, cedro",
  },
  "acqua-di-gio-profondo": {
    salida: "Bergamota verde, mandarina, notas marinas",
    corazon: "Romero, salvia, lavanda",
    fondo: "Pachulí, incienso, almizcle mineral",
  },
  "asad-bourbon": {
    salida: "Pimienta rosa, lavanda, geranio",
    corazon: "Vainilla bourbon, cacao, canela",
    fondo: "Haba tonka, ámbar, vetiver, pachulí",
  },
  asad: {
    salida: "Pimienta negra, tabaco, anís",
    corazon: "Vainilla, ámbar",
    fondo: "Madera de oud, almizcle, pachulí",
  },
  "phantom-pr": {
    salida: "Limón, lavanda, lima",
    corazon: "Manzana verde, lavanda, notas acuáticas",
    fondo: "Vetiver, pachulí, vainilla, ámbar",
  },
  "ysl-y": {
    salida: "Manzana, jengibre, bergamota",
    corazon: "Salvia, flor de azahar del Brasil, acorde herbal",
    fondo: "Almizcle, cedro, vetiver, pachulí",
  },
  "dior-sauvage": {
    salida: "Bergamota de Calabria, pimienta",
    corazon: "Ambroxan, lavanda, pimienta de Sichuan",
    fondo: "Cedro, ládano",
  },
  "la-vie-est-belle": {
    salida: "Grosella negra, pera",
    corazon: "Iris, jazmín, flor de azahar",
    fondo: "Praliné, vainilla, pachulí, tonka",
  },
  "le-beau-jpg": {
    salida: "Bergamota, coco",
    corazon: "Tonka, jazmín, ylang-ylang",
    fondo: "Sándalo, ámbar, almizcle",
  },
  "bleu-de-chanel": {
    salida: "Limón, menta, pomelo rosa, jengibre",
    corazon: "Jazmín, nuez moscada, melón",
    fondo: "Cedro, sándalo, pachulí, incienso",
  },
  "chanel-allure-homme": {
    salida: "Limón, durazno, mandarina, anís estrellado",
    corazon: "Cedro, rosa, violeta, pimienta",
    fondo: "Vetiver, sándalo, pachulí, vainilla, tonka",
  },
  "lacoste-essential": {
    salida: "Tomillo, bergamota, naranja, notas acuáticas",
    corazon: "Pimienta rosa, nuez moscada, cardamomo",
    fondo: "Sándalo, pachulí, vetiver, almizcle",
  },
  "erba-pura": {
    salida: "Limón siciliano, bergamota, naranja",
    corazon: "Frutas mediterráneas, jazmín",
    fondo: "Almizcle blanco, ámbar, vainilla",
  },
};

export function notasPorDefecto(slug: string): NotasOlfativas | null {
  return notasPorSlug[slug] ?? null;
}

export function resolverNotas(
  slug: string,
  db: {
    notasSalida?: string | null;
    notasCorazon?: string | null;
    notasFondo?: string | null;
  }
): NotasOlfativas | null {
  const salida = db.notasSalida?.trim();
  const corazon = db.notasCorazon?.trim();
  const fondo = db.notasFondo?.trim();

  if (salida || corazon || fondo) {
    return {
      salida: salida || "—",
      corazon: corazon || "—",
      fondo: fondo || "—",
    };
  }

  return notasPorDefecto(slug);
}
