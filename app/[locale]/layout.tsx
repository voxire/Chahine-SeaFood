import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter, Archivo_Black, Cairo } from "next/font/google";
import type { ReactNode } from "react";

import { locales, isLocale, type Locale } from "../../i18n";
import { Navbar } from "@/components/nav/Navbar";
import { Footer } from "@/components/sections/Footer";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { ShipsWheelPreloader } from "@/components/ui/ShipsWheelPreloader";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Display font — stands in for the bold, wide, geometric wordmark in the
// Chahine logo. Used for big headings and the brand pill.
const archivo = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

// Arabic body + display. Cairo is a bilingual (Arabic + Latin) typeface
// designed by Mohamed Gaber — warm, connected Arabic letterforms that pair
// cleanly with Inter. Heavy weight 900 stands in for Archivo Black on
// Arabic display headings (Archivo Black has no Arabic subset, so without
// this the browser falls back to disconnected system Arabic).
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-arabic",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const t = await getTranslations({ locale: params.locale, namespace: "meta" });
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: {
      default: t("defaultTitle"),
      template: `%s · Chahine Seafood`,
    },
    description: t("defaultDescription"),
  };
}

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({ children, params }: Props) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;

  // Opt this route into static rendering under next-intl 3.22+. Without this
  // the tree becomes fully dynamic and the build fails to prerender pages.
  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  const fontVars = `${inter.variable} ${archivo.variable} ${cairo.variable}`;

  return (
    <html lang={locale} dir={dir} className={fontVars}>
      {/* Body is intentionally transparent so the <html> element's
          background-color (cream by default, navy under .page-navy
          via BackgroundShift) shows through. The previous
          `bg-cs-bg text-cs-text` Tailwind classes were overriding
          BackgroundShift's crossfade. */}
      <body className="min-h-screen antialiased">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <LenisProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </LenisProvider>
          {/* Custom cursor — on by default for mouse-driven desktop
              (`(hover: hover) and (pointer: fine)`). No-op on touch
              devices, under reduced motion, and when killed via
              `?cursor=0`. Lives outside LenisProvider so the cursor
              position is never tied to Lenis's smoothed scroll — the
              overlay always tracks the real pointer. */}
          <CustomCursor />
          {/* Ship's-wheel brand preloader — mounted at the layout level so
              it appears on every full page load and locale switch, but NOT
              on client-side route transitions (the layout persists across
              them). Renders above everything else including the cursor. */}
          <ShipsWheelPreloader />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
