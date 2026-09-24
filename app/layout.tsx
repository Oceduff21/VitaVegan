import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { Nav } from "@/components/Nav";
import { SiteFooter } from "@/components/SiteFooter";
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
      template: "%s · Verdegan",
    },
    description: t("meta.desc"),
    applicationName: "Verdegan",
    appleWebApp: { capable: true, title: "Verdegan", statusBarStyle: "default" },
    icons: {
      icon: [{ url: "/icon.svg" }, { url: "/icon-512.png", sizes: "512x512", type: "image/png" }],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
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
          <main className="mx-auto w-full max-w-5xl px-3 py-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] sm:px-4 sm:py-5 md:px-6 md:py-8 md:pb-8">
            {children}
            <SiteFooter />
          </main>
        </Providers>
      </body>
    </html>
  );
}
