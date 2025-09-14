"use client";

import { useAppStore } from "@/components/app-provider";
import { useRouter } from "@/i18n/navigation";
import { decodeToken } from "@/lib/utils";
import { useSetTokenToCookie } from "@/queries/useAuth";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const OAuthPage = () => {
  const { setRole, connectSocket } = useAppStore();
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
            connectSocket(accessToken);
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
    connectSocket,
    message,
    refreshToken,
    router,
    setRole,
    setTokenToCookie,
  ]);

  return null;
};
export default OAuthPage;
