"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import RefreshToken from "./refresh-token";
import { createContext, use, useEffect, useState } from "react";
import {
  getAccessTokenFromLocalStorage,
  removeTokensFromLocalStorage,
} from "@/lib/utils";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

interface AppContextType {
  isAuth: boolean;
  setIsAuth: (isAuth: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = use(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuth, setIsAuthState] = useState(false);

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) setIsAuthState(true);
  }, []);

  const setIsAuth = (isAuth: boolean) => {
    setIsAuthState(isAuth);
    if (!isAuth) {
      removeTokensFromLocalStorage();
    }
  };

  const value: AppContextType = {
    isAuth,
    setIsAuth,
  };

  return (
    <AppContext value={value}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext>
  );
};
export default AppProvider;
