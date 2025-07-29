"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const ButtonRedirect = ({ url, label }: { url: string; label: string }) => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(url);
  };
  return <Button onClick={handleNavigate}>{label}</Button>;
};
export default ButtonRedirect;
