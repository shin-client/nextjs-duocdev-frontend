import authApiRequest from "@/apiRequests/auth";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  return useMutation({
    mutationFn: authApiRequest.login,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: authApiRequest.logout,
  });
};

export const useSetTokenToCookie = () => {
  return useMutation({
    mutationFn: authApiRequest.setTokenToCookie,
  });
};
