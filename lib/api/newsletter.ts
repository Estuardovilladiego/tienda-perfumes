import { esModoDemoEstatico } from "@/lib/config";
import { esEmailValido, normalizarEmail } from "@/lib/validate-email";

export async function suscribirNewsletter(emailRaw: string) {
  if (esModoDemoEstatico()) {
    throw new Error(
      "Newsletter requiere MySQL. Configura DATABASE_URL y desactiva USE_STATIC_PRODUCTS."
    );
  }

  const email = normalizarEmail(emailRaw);
  if (!esEmailValido(email)) {
    throw new Error("Correo electrónico no válido");
  }

  const { prisma } = await import("@/lib/prisma");

  const existente = await prisma.suscriptorNewsletter.findUnique({
    where: { email },
  });

  if (existente) {
    return { email, yaRegistrado: true as const };
  }

  await prisma.suscriptorNewsletter.create({ data: { email } });
  return { email, yaRegistrado: false as const };
}
