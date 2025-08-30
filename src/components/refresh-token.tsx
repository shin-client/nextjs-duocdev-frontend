"use client";

import { checkAndRefreshToken } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppContext } from "./app-provider";
import socket from "@/lib/socket";

const UNAUTHENTICATED_PATH = ["/login", "/register", "/refresh-token"];

const RefreshToken = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { setRole } = useAppContext();

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
          router.push("/login");
        },
        force,
      });
    onRefreshToken();

    interval = setInterval(onRefreshToken, TIMEOUT);

    if (socket.connected) {
      onConnect();
    }

    function onConnect() {}

    function onDisconnect() {}

    function onRefreshTokenSocket() {
      onRefreshToken(true);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("refresh-token", onRefreshTokenSocket);
    return () => {
      clearInterval(interval);

      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("refresh-token", onRefreshTokenSocket);
    };
  }, [pathname, router, setRole]);
  return null;
};
export default RefreshToken;
