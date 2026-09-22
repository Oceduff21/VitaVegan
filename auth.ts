import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

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
        if (!user) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "member";
      }
      if (trigger === "update" && session) {
        token.role = session.role ?? token.role;
      }
      if (token.id) {
        try {
          const fresh = await prisma.user.findUnique({
            where: { id: String(token.id) },
            select: { role: true, name: true, email: true },
          });
          if (fresh) {
            token.role = fresh.role;
            token.name = fresh.name;
            token.email = fresh.email;
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
