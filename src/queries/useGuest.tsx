import guestApiRequest from "@/apiRequests/guest";
import { useMutation } from "@tanstack/react-query";

export const useGuestLogin = () => {
  return useMutation({
    mutationFn: guestApiRequest.login,
  });
};

export const useGuestLogout = () => {
  return useMutation({
    mutationFn: guestApiRequest.logout,
  });
};
