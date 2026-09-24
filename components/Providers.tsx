"use client";

import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import { OnboardingTour } from "@/components/OnboardingTour";
import { PwaRegister } from "@/components/PwaRegister";
import type { Locale } from "@/lib/i18n/dictionaries";

export function Providers({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  return (
    <SessionProvider>
      <LanguageProvider initialLocale={locale}>
        {children}
        <OnboardingTour />
        <PwaRegister />
      </LanguageProvider>
    </SessionProvider>
  );
}
