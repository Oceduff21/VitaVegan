"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="mx-auto flex max-w-md flex-col gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Impossible de créer le compte");
          return;
        }
        await signIn("credentials", { email, password, callbackUrl: "/dashboard" });
      }}
    >
      <h1 className="text-3xl">Inscription</h1>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Prénom"
        className="rounded-full border border-forest/20 bg-white px-4 py-2"
      />
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
        minLength={6}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
        className="rounded-full border border-forest/20 bg-white px-4 py-2"
      />
      {error ? <p className="text-terracotta">{error}</p> : null}
      <button type="submit" className="rounded-full bg-forest py-2 text-cream">
        Créer le compte
      </button>
    </form>
  );
}
