/**
 * Reseñas de clientes — edita este archivo con mensajes reales
 * (WhatsApp, Instagram, presencial). Mantén solo testimonios verificables.
 */
export type Testimonial = {
  name: string;
  city: string;
  text: string;
  rating: number;
  /** Perfume mencionado, si aplica */
  product?: string;
  /** Ej: "WhatsApp", "Instagram" */
  source?: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Daniela M.",
    city: "Barranquilla",
    product: "Khamrah",
    source: "WhatsApp",
    text: "Pedí Khamrah un sábado, me confirmaron al toque y el domingo ya lo tenía en casa. Huele delicioso y dura todo el día. 100% recomendada Essenza.",
    rating: 5,
  },
  {
    name: "Jhon A.",
    city: "Soledad",
    product: "Asad",
    source: "Instagram",
    text: "Llevaba tiempo buscando Asad original y aquí lo encontré a buen precio. Pago por Nequi sin problema y el envío fue rapidísimo.",
    rating: 5,
  },
  {
    name: "Valentina R.",
    city: "Puerto Colombia",
    product: "Yara",
    source: "WhatsApp",
    text: "Compré Yara de regalo para mi mamá. La atención por WhatsApp fue súper amable y el perfume llegó bien empacado. Volveré a pedir.",
    rating: 5,
  },
];
