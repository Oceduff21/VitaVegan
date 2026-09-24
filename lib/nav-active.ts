export function navIsActive(path: string, href: string) {
  if (path === href || (href !== "/" && path.startsWith(href))) return true;
  if (href === "/scan") return ["/historique", "/comparer", "/menu"].some((p) => path.startsWith(p));
  if (href === "/recettes") return path.startsWith("/courses");
  return false;
}
