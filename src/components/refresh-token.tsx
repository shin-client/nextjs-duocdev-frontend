"use client";

import authApiRequest from "@/apiRequests/auth";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import { decode } from "jsonwebtoken";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const UNAUTHENTICATED_PATH = ["/login", "/register", "/refresh-token"];

const RefreshToken = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let interval: any = null;
    const TIMEOUT = 1000;

    const checkAndRefreshToken = async () => {
      const accessToken = getAccessTokenFromLocalStorage();
      const refreshToken = getRefreshTokenFromLocalStorage();

      if (!accessToken || !refreshToken) return;

      const decodedAccessToken = decode(accessToken) as {
        exp: number;
        iat: number;
      };
      const decodedRefreshToken = decode(refreshToken) as {
        exp: number;
        iat: number;
      };
      const now = Math.round(new Date().getTime() / 1000);

      if (decodedRefreshToken.exp <= now) return;

      if (
        decodedAccessToken.exp - now <
        (decodedAccessToken.exp - decodedAccessToken.iat) / 3
      ) {
        try {
          const res = await authApiRequest.refreshToken();
          setAccessTokenToLocalStorage(res.payload.data.accessToken);
          setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
        } catch {
          clearInterval(interval);
        }
      }
    };

    checkAndRefreshToken();

    interval = setInterval(checkAndRefreshToken, TIMEOUT);
    return () => clearInterval(interval);
  }, [pathname]);
  return null;
};
export default RefreshToken;
