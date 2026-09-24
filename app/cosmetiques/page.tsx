import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CosmeticsClient } from "@/components/CosmeticsClient";

export default async function CosmetiquesPage() {
  const session = await auth();
  if (!session?.user) redirect("/inscription");
  return <CosmeticsClient />;
}
