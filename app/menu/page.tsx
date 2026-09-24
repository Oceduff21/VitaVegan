import { requireFullApp } from "@/lib/access";
import { MenuScanClient } from "@/components/MenuScanClient";

export default async function MenuPage() {
  await requireFullApp();
  return <MenuScanClient />;
}
