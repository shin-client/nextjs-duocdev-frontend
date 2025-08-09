import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import AppProvider from "@/components/app-provider";

const roboto = Roboto({
  display: "swap",
  subsets: ["vietnamese"],
});

export const metadata: Metadata = {
  title: "Big Boy Restaurant",
  description: "The best restaurant in the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
            {children}
          </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  );
}
