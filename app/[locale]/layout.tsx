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
      <body className="min-h-screen bg-cs-bg text-cs-text antialiased">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
