import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import AppProvider from "@/components/app-provider";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const roboto = Roboto({
  display: "swap",
  subsets: ["vietnamese"],
});

export const metadata: Metadata = {
  title: "Big Boy Restaurant",
  description: "The best restaurant in the world",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head />
      <body
        className={`${roboto.className} bg-background min-h-screen antialiased`}
      >
        <AppProvider>
          <Toaster position="top-center" richColors />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider>{children}</NextIntlClientProvider>
          </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  );
}
