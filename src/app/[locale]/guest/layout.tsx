import { defaultLocale } from "@/i18n/config";
import Layout from "../(public)/layout";

export default function GuestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout modal={null} params={Promise.resolve({ locale: defaultLocale })}>
      {children}
    </Layout>
  );
}
