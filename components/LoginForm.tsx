"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="mx-auto flex max-w-md flex-col gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (res?.error) setError("Email ou mot de passe incorrect.");
        else window.location.href = "/dashboard";
      }}
    >
      <h1 className="text-3xl">Connexion</h1>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="rounded-full border border-forest/20 bg-white px-4 py-2"
      />
      <input
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
        className="rounded-full border border-forest/20 bg-white px-4 py-2"
      />
      {error ? <p className="text-terracotta">{error}</p> : null}
      <button type="submit" className="rounded-full bg-forest py-2 text-cream">
        Entrer
      </button>
      <p className="text-sm">
        Pas encore de compte ? <Link href="/inscription">Inscription</Link>
      </p>
      <p className="text-xs text-ink/50">Démo : demo@vitavegan.app / demo123 — admin@vitavegan.app / admin123</p>
    </form>
  );
}
