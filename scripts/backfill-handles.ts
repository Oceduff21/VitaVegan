import { PrismaClient } from "@prisma/client";
import { allocateHandle } from "../lib/allocate-handle";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { OR: [{ handle: null }, { handle: "" }] },
  });
  for (const u of users) {
    const h = await allocateHandle(u.firstName || u.name || "membre");
    await prisma.user.update({ where: { id: u.id }, data: { handle: h } });
    console.log(u.email, "->", h);
  }
  console.log("done", users.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
