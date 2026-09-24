import { prisma } from "@/lib/prisma";
import { normalizeHandle, suggestHandle, validateHandle } from "@/lib/public-author";

/** Find a free handle from a name seed. */
export async function allocateHandle(seed: string) {
  let base = suggestHandle(seed);
  if (validateHandle(base)) base = "membre";
  for (let i = 0; i < 80; i++) {
    const candidate = i === 0 ? base : `${base.slice(0, 14)}${i + 1}`;
    const h = normalizeHandle(candidate);
    if (validateHandle(h)) continue;
    const taken = await prisma.user.findUnique({ where: { handle: h }, select: { id: true } });
    if (!taken) return h;
  }
  return `u${Date.now().toString(36)}`.slice(0, 20);
}
