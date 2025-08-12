"use client";
import {
  checkAndRefreshToken,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const RefreshTokenPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshTokenFormUrl = searchParams.get("refreshToken");
  const redirectPathname = searchParams.get("redirect");
  const { mutateAsync } = useLogoutMutation();

  useEffect(() => {
    if (
      refreshTokenFormUrl &&
      refreshTokenFormUrl === getRefreshTokenFromLocalStorage()
    ) {
      checkAndRefreshToken({
        onSuccess: () => {
          router.push(redirectPathname || "/");
        },
      });
    }
  }, [mutateAsync, redirectPathname, refreshTokenFormUrl, router]);

  return (
    <div className="flex items-center justify-center">
      <div>Đang đăng xuất...</div>
    </div>
  );
};
export default RefreshTokenPage;
