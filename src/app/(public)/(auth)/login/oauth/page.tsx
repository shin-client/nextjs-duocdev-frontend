"use client";

import { useAppContext } from "@/components/app-provider";
import { createSocket, decodeToken } from "@/lib/utils";
import { useSetTokenToCookie } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const OAuthPage = () => {
  const { setRole, setSocket } = useAppContext();
  const searchParams = useSearchParams();
  const router = useRouter();
  const count = useRef(0);

  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const message = searchParams.get("message");

  const { mutateAsync: setTokenToCookie } = useSetTokenToCookie();

  useEffect(() => {
    if (accessToken && refreshToken) {
      if (count.current === 0) {
        const { role } = decodeToken(accessToken);
        setTokenToCookie({ accessToken, refreshToken })
          .then(() => {
            setRole(role);
            setSocket(createSocket(accessToken));
            router.push("/manage/dashboard");
          })
          .catch((e) => toast.error(e.message || "Có lỗi xảy ra!"));
        count.current++;
      }
    } else {
      toast.error(message || "Có lỗi xảy ra!");
    }
  }, [
    accessToken,
    message,
    refreshToken,
    router,
    setRole,
    setSocket,
    setTokenToCookie,
  ]);

  return null;
};
export default OAuthPage;
