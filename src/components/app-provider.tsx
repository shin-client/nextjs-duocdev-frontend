"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import RefreshToken from "./refresh-token";
import { useEffect } from "react";
import {
  createSocket,
  decodeToken,
  getAccessTokenFromLocalStorage,
  removeTokensFromLocalStorage,
} from "@/lib/utils";
import { RoleType } from "@/types/jwt.types";
import type { Socket } from "socket.io-client";
import ListenLogoutSocket from "@/components/listen-logout-socket";
import { create } from "zustand";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

interface AppStoreState {
  role: RoleType | undefined;
  setRole: (role?: RoleType | undefined) => void;
  socket: Socket | undefined;
  setSocket: (socket: Socket | undefined) => void;
  connectSocket: (accessToken: string) => void;
  disconnectSocket: () => void;
}

export const useAppStore = create<AppStoreState>((set, get) => ({
  bears: 0,
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType | undefined) => {
    set({ role });
    if (!role) removeTokensFromLocalStorage();
  },
  socket: undefined as Socket | undefined,
  setSocket: (socket: Socket | undefined) => set({ socket }),
  connectSocket: (accessToken: string) => {
    const currentSocket = get().socket;
    if (currentSocket) {
      currentSocket.disconnect();
    }
    const newSocket = createSocket(accessToken);
    set({ socket: newSocket });
  },
  disconnectSocket: () =>
    set((state) => {
      state.socket?.disconnect();
      return { socket: undefined };
    }),
}));

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { setRole, connectSocket } = useAppStore();

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      const role = decodeToken(accessToken).role;
      setRole(role);
      connectSocket(accessToken);
    }
  }, [connectSocket, setRole]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <RefreshToken />
      <ListenLogoutSocket />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
export default AppProvider;
