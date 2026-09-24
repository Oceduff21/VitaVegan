"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navIsActive } from "@/lib/nav-active";

export function DesktopNav({ links }: { links: { href: string; label: string }[] }) {
  const path = usePathname();
  return (
    <nav
      className="flex max-w-full flex-nowrap items-center justify-center gap-0 overflow-x-auto rounded-full bg-ink/5 p-0.5 text-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Principal"
    >
      {links.map((l) => {
        const active = navIsActive(path, l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 rounded-full px-2.5 py-1.5 font-semibold whitespace-nowrap lg:px-3.5 ${
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
