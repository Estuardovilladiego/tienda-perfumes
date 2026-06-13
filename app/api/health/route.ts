import { jsonOk } from "@/lib/api/http";
import { esModoDemoEstatico } from "@/lib/config";

export async function GET() {
  return jsonOk({
    status: "ok",
    servicio: "essenza-api",
    fuenteDatos: esModoDemoEstatico() ? "estatico" : "mysql",
    version: "1.0.0",
  });
}
