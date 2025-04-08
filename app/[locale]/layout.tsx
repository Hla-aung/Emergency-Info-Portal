import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import { routing } from "../../i18n/routing";
import { Metadata } from "next";
import { Providers } from "../providers";
import { getMessages } from "next-intl/server";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

const APP_NAME = "Emergency Info Portal";
const APP_DESCRIPTION = "Emergency information and shelter locator for Myanmar";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: APP_NAME,
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
};

const inter = Inter({ subsets: ["latin"] });

export default async function LocaleLayout({ children, params }: Props) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={cn("w-full min-h-screen", inter.className)}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
