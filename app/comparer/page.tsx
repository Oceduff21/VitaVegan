import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CompareClient } from "@/components/compare/CompareClient";

export default async function ComparerPage() {
  const session = await auth();
  if (!session?.user) redirect("/inscription");
  return (
    <Suspense>
      <CompareClient />
    </Suspense>
  );
}
