import type { ReactNode } from "react";
import { IconSearch } from "@/components/nav-icons";

export function SearchRow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`search-row ${className}`}>
      <span className="search-icon" aria-hidden>
        <IconSearch className="h-5 w-5" />
      </span>
      {children}
    </div>
  );
}
