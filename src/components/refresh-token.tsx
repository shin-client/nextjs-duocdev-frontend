"use client";

import { checkAndRefreshToken } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppContext } from "./app-provider";

const UNAUTHENTICATED_PATH = ["/login", "/register", "/refresh-token"];

const RefreshToken = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { setIsAuth } = useAppContext();

  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let interval: any = null;
    const TIMEOUT = 1000;

    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval);
        setIsAuth(false);
        router.push("/login");
      },
    });

    interval = setInterval(
      () =>
        checkAndRefreshToken({
          onError: () => {
            clearInterval(interval);
            setIsAuth(false);
            router.push("/login");
          },
        }),
      TIMEOUT,
    );
    return () => clearInterval(interval);
  }, [pathname, router, setIsAuth]);
  return null;
};
export default RefreshToken;
