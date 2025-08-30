import { handleErrorApi } from "@/lib/utils";
import { useLogout } from "@/queries/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppContext } from "./app-provider";

const UNAUTHENTICATED_PATH = ["/login", "/register", "/refresh-token"];

const ListenLogoutSocket = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { socket, setRole, disconnectSocket } = useAppContext();

  const { mutateAsync: triggerLogout, isPending } = useLogout();

  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;

    async function onLogout() {
      if (isPending) return;
      try {
        await triggerLogout();
        setRole();
        disconnectSocket();
        router.push("/login");
      } catch (error) {
        handleErrorApi({ error });
      }
    }

    socket?.on("logout", onLogout);

    return () => {
      socket?.off("logout", onLogout);
    };
  }, [
    disconnectSocket,
    isPending,
    pathname,
    router,
    setRole,
    socket,
    triggerLogout,
  ]);

  return null;
};
export default ListenLogoutSocket;
