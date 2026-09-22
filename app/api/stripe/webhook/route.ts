import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/billing";

export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ received: true, skipped: true });
  }
  const raw = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "no sig" }, { status: 400 });
  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          role: "subscriber",
          subStatus: "active",
          stripeCustomerId: String(session.customer ?? ""),
          stripeSubId: String(session.subscription ?? ""),
        },
      });
    }
  }
  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object;
    const user = await prisma.user.findFirst({ where: { stripeSubId: sub.id } });
    if (user && user.role !== "admin") {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: "member", subStatus: "canceled" },
      });
    }
  }
  return NextResponse.json({ received: true });
}
