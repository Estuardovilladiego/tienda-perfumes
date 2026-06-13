import { site } from "@/lib/site";

export type LegalSection = {
  titulo: string;
  parrafos: string[];
};

export const faqItems = [
  {
    pregunta: "¿Qué significa perfumes 1.1?",
    respuesta:
      "En Essenza ofrecemos perfumes 1.1: fragancias de inspiración con excelente fidelidad olfativa y presentación cuidada. No son productos de las casas originales.",
  },
  {
    pregunta: "¿Cómo hago un pedido?",
    respuesta:
      "Agrega los perfumes al carrito, completa tus datos de entrega, elige el método de pago y confirma. Luego envías el comprobante por WhatsApp con tu número de pedido.",
  },
  {
    pregunta: "¿Cuánto tarda el envío?",
    respuesta: `En ${site.ciudad} el envío es gratuito y suele demorar 1 a 2 días hábiles. A otras ciudades de Colombia coordinamos el envío por WhatsApp según la transportadora.`,
  },
  {
    pregunta: "¿Qué métodos de pago aceptan?",
    respuesta:
      "Nequi, Daviplata, Llaves (Bre-B), transferencia Bancolombia, Falabella, Sistecredito y Addi. Al confirmar tu pedido recibirás las instrucciones exactas según el método elegido.",
  },
  {
    pregunta: "¿Puedo cambiar o cancelar mi pedido?",
    respuesta: `Escríbenos por WhatsApp al ${site.whatsappDisplay} lo antes posible. Si el pedido aún no ha sido despachado, podemos ayudarte con cambios o cancelación.`,
  },
  {
    pregunta: "¿Hacen devoluciones?",
    respuesta:
      "Por tratarse de productos de higiene personal, no aceptamos devoluciones una vez abierto el producto. Si llega dañado o incorrecto, contáctanos dentro de las 48 horas posteriores a la entrega.",
  },
];

export const privacidadSections: LegalSection[] = [
  {
    titulo: "Responsable del tratamiento",
    parrafos: [
      `${site.nombreCompleto}, con operación en ${site.ciudad}, es responsable del tratamiento de los datos personales que nos proporciones al usar esta tienda en línea.`,
      `Contacto: ${site.email} · WhatsApp ${site.whatsappDisplay}.`,
    ],
  },
  {
    titulo: "Datos que recopilamos",
    parrafos: [
      "Al realizar un pedido recopilamos nombre, teléfono, dirección, ciudad y, opcionalmente, correo electrónico.",
      "Si te suscribes al newsletter, guardamos tu correo para enviarte novedades y promociones.",
      "También registramos información técnica básica de navegación (cookies esenciales del sitio).",
    ],
  },
  {
    titulo: "Finalidad del uso",
    parrafos: [
      "Procesar y entregar tus pedidos.",
      "Contactarte por WhatsApp o correo sobre el estado de tu compra.",
      "Enviar información comercial solo si te suscribiste al newsletter.",
      "Mejorar nuestro catálogo y la experiencia de compra.",
    ],
  },
  {
    titulo: "Conservación y seguridad",
    parrafos: [
      "Conservamos los datos de pedidos el tiempo necesario para cumplir obligaciones legales y comerciales.",
      "Aplicamos medidas razonables de seguridad en nuestros sistemas. No vendemos ni cedemos tus datos a terceros con fines comerciales.",
    ],
  },
  {
    titulo: "Tus derechos",
    parrafos: [
      "Puedes solicitar acceso, corrección o eliminación de tus datos escribiendo a nuestro correo o WhatsApp.",
      "Puedes darte de baja del newsletter en cualquier momento contactándonos.",
    ],
  },
];

export const terminosSections: LegalSection[] = [
  {
    titulo: "Aceptación",
    parrafos: [
      `Al usar el sitio web de ${site.nombreCompleto} y realizar compras, aceptas estos términos y condiciones.`,
    ],
  },
  {
    titulo: "Productos y precios",
    parrafos: [
      "Los precios están expresados en pesos colombianos (COP) e incluyen la información visible en cada producto al momento de la compra.",
      "Nos reservamos el derecho de corregir errores de precio o disponibilidad antes de confirmar un pedido.",
      "La disponibilidad depende del stock en tiempo real.",
    ],
  },
  {
    titulo: "Proceso de compra",
    parrafos: [
      "El pedido se considera recibido cuando lo registras en la tienda. La confirmación definitiva ocurre cuando verificamos tu pago por WhatsApp.",
      "Si no recibimos el comprobante en un plazo razonable, el pedido puede ser cancelado y el stock liberado.",
    ],
  },
  {
    titulo: "Envíos",
    parrafos: [
      `Ofrecemos envío gratuito dentro de ${site.ciudad}. Para otras ciudades, el costo y tiempo de entrega se acuerdan al coordinar por WhatsApp.`,
      "Los tiempos de entrega son estimados y pueden variar por factores logísticos fuera de nuestro control.",
    ],
  },
  {
    titulo: "Propiedad intelectual",
    parrafos: [
      "El diseño del sitio, textos, logotipos e imágenes propias de Essenza están protegidos. Las marcas de perfumes pertenecen a sus respectivos titulares.",
    ],
  },
  {
    titulo: "Contacto",
    parrafos: [
      `Para consultas sobre estos términos: ${site.email} · WhatsApp ${site.whatsappDisplay}.`,
    ],
  },
];
