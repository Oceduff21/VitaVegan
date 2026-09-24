"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navIsActive } from "@/lib/nav-active";

export function DesktopNav({ links }: { links: { href: string; label: string }[] }) {
  const path = usePathname();
  return (
    <nav className="hidden items-center rounded-full bg-ink/5 p-1 text-sm md:flex" aria-label="Principal">
      {links.map((l) => {
        const active = navIsActive(path, l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-3.5 py-1.5 font-semibold ${
              active ? "bg-white text-forest shadow-sm" : "text-ink/60 hover:text-ink"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}

