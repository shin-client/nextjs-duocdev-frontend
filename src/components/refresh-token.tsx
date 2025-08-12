"use client";

import { checkAndRefreshToken } from "@/lib/utils";
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

    checkAndRefreshToken({ onError: () => clearInterval(interval) });

    interval = setInterval(checkAndRefreshToken, TIMEOUT);
    return () => clearInterval(interval);
  }, [pathname]);
  return null;
};
export default RefreshToken;
