import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Providers } from "@/components/Providers";
import { getLocale, getT } from "@/lib/i18n/server";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const dm = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return {
    title: {
      default: t("meta.title"),
      template: "%s · VitaVegan",
    },
    description: t("meta.desc"),
    applicationName: "VitaVegan",
    appleWebApp: { capable: true, title: "VitaVegan", statusBarStyle: "default" },
  };
}

export const viewport: Viewport = {
  themeColor: "#1F4D3A",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={`${fraunces.variable} ${dm.variable}`}>
      <body className="min-h-screen antialiased">
        <Providers locale={locale}>
          <Nav />
          <main className="mx-auto max-w-5xl px-4 py-5 pb-[calc(6.25rem+env(safe-area-inset-bottom))] md:px-6 md:py-8 md:pb-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
