/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "sonner";
import { decode } from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field as "email" | "password", {
        type: "server",
        message: item.message,
      });
    });
  } else
    toast.error("Lỗi", {
      description: error?.payload?.message ?? "Lỗi không xác định",
      duration: duration ?? 5000,
    });
};

const isBrowser = typeof window !== "undefined";

export const getAccessTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("accessToken") : null;
};

export const getRefreshTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("refreshToken") : null;
};

export const setAccessTokenToLocalStorage = (value: string) => {
  return isBrowser && localStorage.setItem("accessToken", value);
};

export const setRefreshTokenToLocalStorage = (value: string) => {
  return isBrowser && localStorage.setItem("refreshToken", value);
};

export const checkAndRefreshToken = async (param?: {
  onError?: () => void;
  onSuccess?: () => void;
}) => {
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

  if (decodedRefreshToken.exp <= now) return param?.onError && param.onError();

  if (
    decodedAccessToken.exp - now <
    (decodedAccessToken.exp - decodedAccessToken.iat) / 3
  ) {
    try {
      const res = await authApiRequest.refreshToken();
      setAccessTokenToLocalStorage(res.payload.data.accessToken);
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
      param?.onSuccess?.();
    } catch {
      param?.onError?.();
    }
  }
};
