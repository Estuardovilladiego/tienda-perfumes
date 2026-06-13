import HomeClient from "./components/HomeClient";
import { esModoDemoEstatico } from "@/lib/config";
import { getDestacados } from "@/lib/productos";

export default async function Home() {
  const { productos: destacados } = await getDestacados(4);

  return (
    <HomeClient
      destacados={destacados}
      mostrarAvisoDemo={esModoDemoEstatico()}
    />
  );
}
