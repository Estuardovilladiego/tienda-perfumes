import "dotenv/config";

import { prisma } from "../lib/prisma";

async function main() {
  const count = await prisma.producto.count();
  console.log("OK productos:", count);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("FAIL", error);
  process.exit(1);
});
