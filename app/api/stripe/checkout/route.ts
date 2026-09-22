import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStripe, stripeEnabled } from "@/lib/billing";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
  const { plan } = (await req.json()) as { plan?: "monthly" | "yearly" | "demo" };

  if (plan === "demo" || !stripeEnabled()) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "subscriber", subStatus: "demo" },
    });
    return NextResponse.json({ ok: true, mode: "demo" });
  }

  const stripe = getStripe();
  const price = plan === "yearly" ? process.env.STRIPE_PRICE_YEARLY : process.env.STRIPE_PRICE_MONTHLY;
  if (!stripe || !price) {
    return NextResponse.json({ error: "Stripe n'est pas configuré." }, { status: 500 });
  }
  const origin = new URL(req.url).origin;
  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price, quantity: 1 }],
    success_url: `${origin}/compte?checkout=success`,
    cancel_url: `${origin}/compte?checkout=cancel`,
    customer_email: session.user.email ?? undefined,
    metadata: { userId: session.user.id },
  });
  return NextResponse.json({ url: checkout.url });
}
