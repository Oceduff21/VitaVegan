import { prisma } from "@/lib/prisma";

export async function pushNotification(input: {
  userId: string;
  type: string;
  title: string;
  body?: string;
  href?: string;
  payload?: Record<string, unknown>;
}) {
  return prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      body: input.body ?? "",
      href: input.href ?? "",
      payload: JSON.stringify(input.payload ?? {}),
    },
  });
}

export async function notifyLeafLevel(userId: string, title: string, body: string) {
  return pushNotification({
    userId,
    type: "leaf",
    title,
    body,
    href: "/compte#compte-style",
  });
}

export async function unreadNotifications(userId: string, take = 8) {
  return prisma.notification.findMany({
    where: { userId, readAt: null },
    orderBy: { createdAt: "desc" },
    take,
  });
}
