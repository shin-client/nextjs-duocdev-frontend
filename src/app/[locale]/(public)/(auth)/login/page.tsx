import LoginForm from "@/app/[locale]/(public)/(auth)/login/login-form";
import LoadingFallback from "@/components/loading-fallback";
import { Suspense } from "react";

// Lazy load
// const LoginForm = lazy(() => import("./login-form"));

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginForm />
    </Suspense>
  );
}
