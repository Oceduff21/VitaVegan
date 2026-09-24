import Link from "next/link";
import { IconAcademy } from "@/components/nav-icons";

/** Compact home entry so Academy stays visible without competing with the scan CTA. */
export function HomeAcademyInvite({
  title,
  lead,
  cta,
  href = "/academie",
  chips,
}: {
  title: string;
  lead: string;
  cta: string;
  href?: string;
  chips?: { href: string; label: string }[];
}) {
  return (
    <section className="home-academy overflow-hidden rounded-2xl bg-forest px-3 py-2.5 text-cream sm:px-4 sm:py-3">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-cream/15 text-cream" aria-hidden>
          <IconAcademy className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="display text-[0.95rem] leading-tight text-cream sm:text-lg">{title}</h2>
          <p className="mt-0.5 line-clamp-2 text-[0.7rem] leading-snug text-cream/80 sm:line-clamp-1 sm:text-xs">
            {lead}
          </p>
          {chips && chips.length > 0 ? (
            <div className="mt-1.5 flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {chips.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="shrink-0 rounded-full bg-cream/12 px-2 py-0.5 text-[0.65rem] font-semibold text-cream ring-1 ring-cream/25"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
        <Link
          href={href}
          className="btn btn-secondary h-8 min-h-8 shrink-0 border-0 px-3 text-xs sm:h-9 sm:min-h-9 sm:px-4 sm:text-sm"
        >
          {cta}
        </Link>
      </div>
    </section>
  );
}
