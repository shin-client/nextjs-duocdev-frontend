"use client";

import LoadingFallback from "@/components/loading-fallback";
import { useRouter } from "@/i18n/navigation";
import {
  checkAndRefreshToken,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

const RefreshToken = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshTokenFormUrl = searchParams.get("refreshToken");
  const redirectPathname = searchParams.get("redirect");

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
    } else router.push("/");
  }, [redirectPathname, refreshTokenFormUrl, router]);

  return (
    <div className="flex items-center justify-center">
      <div>Đang làm mới token...</div>
    </div>
  );
};

const RefreshTokenPage = () => {
  return (
    <Suspense
      fallback={
        <LoadingFallback />
      }
    >
      <RefreshToken />
    </Suspense>
  );
};
export default RefreshTokenPage;
