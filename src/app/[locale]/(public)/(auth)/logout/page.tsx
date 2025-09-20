"use client";

import { useAppStore } from "@/components/app-provider";
import SearchParamsLoader, {
  useSearchParamsLoader,
} from "@/components/search-params-loader";
import { useRouter } from "@/i18n/navigation";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useLogout } from "@/queries/useAuth";
import { useEffect, useRef } from "react";

const LogoutPage = () => {
  const router = useRouter();
  const { setRole, disconnectSocket } = useAppStore();
  const { searchParams, setSearchParams } = useSearchParamsLoader();
  const refreshTokenFormUrl = searchParams?.get("refreshToken");
  const accessTokenFormUrl = searchParams?.get("accessToken");
  const hasExecuted = useRef(false);
  const { mutateAsync } = useLogout();

  useEffect(() => {
    if (hasExecuted.current) return;

    const shouldLogout = () => {
      const currentRefreshToken = getRefreshTokenFromLocalStorage();
      const currentAccessToken = getAccessTokenFromLocalStorage();

      // Nếu không có token từ URL, thực hiện logout bình thường
      if (!refreshTokenFormUrl && !accessTokenFormUrl) return true;

      // Nếu có token từ URL, kiểm tra có khớp với token hiện tại không
      return (
        (!refreshTokenFormUrl || refreshTokenFormUrl === currentRefreshToken) &&
        (!accessTokenFormUrl || accessTokenFormUrl === currentAccessToken)
      );
    };

    if (shouldLogout()) {
      hasExecuted.current = true;
      mutateAsync().then(() => router.push("/login"));
      setRole();
      disconnectSocket();
    } else {
      router.push("/");
    }
  }, [
    accessTokenFormUrl,
    disconnectSocket,
    mutateAsync,
    refreshTokenFormUrl,
    router,
    setRole,
  ]);

  return (
    <div className="flex items-center justify-center">
      <SearchParamsLoader onParamsReceived={setSearchParams} />
      <div>Đang đăng xuất...</div>
    </div>
  );
};

export default LogoutPage;
