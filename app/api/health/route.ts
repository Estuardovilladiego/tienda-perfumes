import { jsonOk } from "@/lib/api/http";
import { esModoDemoEstatico } from "@/lib/config";
import { smtpEstaConfigurado } from "@/lib/email-deliverability";

export async function GET() {
  return jsonOk({
    status: "ok",
    servicio: "essenza-api",
    fuenteDatos: esModoDemoEstatico() ? "estatico" : "mysql",
    smtpConfigurado: smtpEstaConfigurado(),
    version: "1.0.0",
  });
}
