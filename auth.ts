import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { upsertOAuthUser } from "@/lib/oauth";

const oauthProviders = [
  ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
    ? [
        Google({
          clientId: process.env.AUTH_GOOGLE_ID,
          clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
      ]
    : []),
  ...(process.env.AUTH_APPLE_ID && process.env.AUTH_APPLE_SECRET
    ? [
        Apple({
          clientId: process.env.AUTH_APPLE_ID,
          clientSecret: process.env.AUTH_APPLE_SECRET,
        }),
      ]
    : []),
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/connexion" },
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "")
          .toLowerCase()
          .trim();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          trialEndsAt: user.trialEndsAt?.toISOString() ?? null,
        };
      },
    }),
    ...oauthProviders,
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (account && user?.email && (account.provider === "google" || account.provider === "apple")) {
        const dbUser = await upsertOAuthUser({ email: user.email, name: user.name });
        token.id = dbUser.id;
        token.role = dbUser.role;
        token.trialEndsAt = dbUser.trialEndsAt?.toISOString() ?? null;
        token.name = dbUser.name;
        token.email = dbUser.email;
      } else if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "member";
        token.trialEndsAt = (user as { trialEndsAt?: string | null }).trialEndsAt ?? null;
      }
      if (trigger === "update" && session) {
        token.role = session.role ?? token.role;
      }
      if (token.id) {
        try {
          const fresh = await prisma.user.findUnique({
            where: { id: String(token.id) },
            select: { role: true, name: true, email: true, trialEndsAt: true },
          });
          if (fresh) {
            token.role = fresh.role;
            token.name = fresh.name;
            token.email = fresh.email;
            token.trialEndsAt = fresh.trialEndsAt?.toISOString() ?? null;
          }
        } catch {
          /* db maybe unavailable at build */
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.role = String(token.role ?? "member");
        session.user.trialEndsAt = (token.trialEndsAt as string | null) ?? null;
      }
      return session;
    },
  },
});

export function isSubscriber(role?: string | null) {
  return role === "subscriber" || role === "admin";
}

export function isAdmin(role?: string | null) {
  return role === "admin";
}
