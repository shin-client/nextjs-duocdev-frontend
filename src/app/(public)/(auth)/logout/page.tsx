"use client";
import { getRefreshTokenFromLocalStorage } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const Logout = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshTokenFormUrl = searchParams.get("refreshToken");
  const { mutateAsync } = useLogoutMutation();

  useEffect(() => {
    if (refreshTokenFormUrl !== getRefreshTokenFromLocalStorage()) return;
    mutateAsync().then(() => {
      router.push("/login");
    });
  }, [mutateAsync, refreshTokenFormUrl, router]);
  return;
};
export default Logout;
