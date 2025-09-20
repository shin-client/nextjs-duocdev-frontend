import LoginForm from "@/app/[locale]/(public)/(auth)/login/login-form";

// Lazy load
// const LoginForm = lazy(() => import("./login-form"));

export default function LoginPage() {
  return <LoginForm />;
}
