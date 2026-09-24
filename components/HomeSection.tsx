import type { ReactNode } from "react";
import Link from "next/link";

/** Section header for premium home categories. */
export function HomeSection({
  eyebrow,
  title,
  lead,
  actionHref,
  actionLabel,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  actionHref?: string;
  actionLabel?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-leaf sm:text-xs">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-lg leading-tight sm:text-xl">{title}</h2>
          {lead ? <p className="mt-0.5 max-w-xl text-sm text-ink/60">{lead}</p> : null}
        </div>
        {actionHref && actionLabel ? (
          <Link href={actionHref} className="self-start text-sm font-semibold text-forest underline">
            {actionLabel}
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
