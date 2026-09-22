import Link from "next/link";
import { auth, signOut } from "@/auth";
import { isAdmin, isSubscriber } from "@/auth";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

const links = [
  { href: "/scan", label: "Scan" },
  { href: "/dashboard", label: "Jauges" },
  { href: "/recettes", label: "Recettes" },
  { href: "/academie", label: "Académie" },
];

export async function Nav() {
  const session = await auth();
  const role = session?.user?.role;

  return (
    <header className="sticky top-0 z-20 border-b border-forest/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="display text-xl text-forest">
          VitaVegan
        </Link>
        <nav className="hidden items-center gap-4 text-sm sm:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-leaf">
              {l.label}
            </Link>
          ))}
          {isAdmin(role) ? (
            <Link href="/admin" className="hover:text-leaf">
              Admin
            </Link>
          ) : null}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <LanguageSwitcher />
          {session?.user ? (
            <>
              <Link href="/compte" className="hidden sm:inline">
                {session.user.name}
                {isSubscriber(role) ? (
                  <span className="ml-1 rounded-full bg-leaf/15 px-2 py-0.5 text-xs text-leaf">abo</span>
                ) : null}
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit" className="text-ink/60 hover:text-ink">
                  Sortir
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/connexion"
              className="rounded-full bg-forest px-3 py-1.5 text-cream"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
      <nav className="flex justify-around border-t border-forest/10 px-2 py-2 text-xs sm:hidden">
        {links.map((l) => (
          <Link key={l.href} href={l.href}>
            {l.label}
          </Link>
        ))}
        <Link href="/compte">Compte</Link>
      </nav>
    </header>
  );
}
