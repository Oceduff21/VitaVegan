import Link from "next/link";

export function ShortcutPills({ items }: { items: { href: string; label: string }[] }) {
  if (items.length === 0) return null;
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Raccourcis">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="chip tap">
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
