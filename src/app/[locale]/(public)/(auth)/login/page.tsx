import LoginForm from "@/app/[locale]/(public)/(auth)/login/login-form";
import { Locale } from "@/i18n/config";
import { getTranslations } from "next-intl/server";

// Lazy load
// const LoginForm = lazy(() => import("./login-form"));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("login.title"),
  };
}

export default function LoginPage() {
  return <LoginForm />;
}
