"use client";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const Logout = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshTokenFormUrl = searchParams.get("refreshToken");
  const accessTokenFormUrl = searchParams.get("accessToken");
  const hasExecuted = useRef(false);
  const { mutateAsync } = useLogoutMutation();

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
    } else {
      router.push("/login");
    }
  }, [accessTokenFormUrl, mutateAsync, refreshTokenFormUrl, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div>Đang đăng xuất...</div>
    </div>
  );
};
export default Logout;
