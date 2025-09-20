"use client";

import SearchParamsLoader, {
  useSearchParamsLoader,
} from "@/components/search-params-loader";
import { useRouter } from "@/i18n/navigation";
import {
  checkAndRefreshToken,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useEffect } from "react";

const RefreshTokenPage = () => {
  const router = useRouter();
  const { searchParams, setSearchParams } = useSearchParamsLoader();
  const refreshTokenFormUrl = searchParams?.get("refreshToken");
  const redirectPathname = searchParams?.get("redirect");

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
      <SearchParamsLoader onParamsReceived={setSearchParams} />
      <div>Đang làm mới token...</div>
    </div>
  );
};

export default RefreshTokenPage;
