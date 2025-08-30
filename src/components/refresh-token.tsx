"use client";

import { checkAndRefreshToken } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppContext } from "./app-provider";

const UNAUTHENTICATED_PATH = ["/login", "/register", "/refresh-token"];

const RefreshToken = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { setRole, socket, disconnectSocket } = useAppContext();

  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let interval: any = null;
    const TIMEOUT = 1000;

    const onRefreshToken = (force?: boolean) =>
      checkAndRefreshToken({
        onError: () => {
          clearInterval(interval);
          setRole();
          disconnectSocket();
          router.push("/login");
        },
        force,
      });
    onRefreshToken();

    interval = setInterval(onRefreshToken, TIMEOUT);

    function onRefreshTokenSocket() {
      onRefreshToken(true);
    }

    socket?.on("refresh-token", onRefreshTokenSocket);
    return () => {
      clearInterval(interval);
      socket?.off("refresh-token", onRefreshTokenSocket);
    };
  }, [disconnectSocket, pathname, router, setRole, socket]);
  return null;
};
export default RefreshToken;
