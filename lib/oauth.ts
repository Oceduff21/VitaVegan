import { prisma } from "@/lib/prisma";
import { trialEndFromNow } from "@/lib/entitlements";
import { allocateHandle } from "@/lib/allocate-handle";

export async function upsertOAuthUser(input: { email: string; name?: string | null }) {
  const email = input.email.toLowerCase().trim();
  const display = (input.name ?? "").trim() || email.split("@")[0] || "Membre";
  const parts = display.split(/\s+/);
  const firstName = parts[0] ?? "Membre";
  const lastName = parts.slice(1).join(" ");
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const handle = existing.handle || (await allocateHandle(existing.firstName || firstName));
    return prisma.user.update({
      where: { id: existing.id },
      data: {
        name: existing.name || display,
        firstName: existing.firstName || firstName,
        lastName: existing.lastName || lastName,
        handle,
      },
    });
  }
  const handle = await allocateHandle(firstName);
  return prisma.user.create({
    data: {
      email,
      name: display,
      firstName,
      lastName,
      handle,
      passwordHash: "",
      trialEndsAt: trialEndFromNow(),
    },
  });
}
