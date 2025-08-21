import guestApiRequest from "@/apiRequests/guest";
import { useMutation, useQuery } from "@tanstack/react-query";

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

export const useGuestOrder = () => {
  return useMutation({
    mutationFn: guestApiRequest.orders,
  });
};

export const useGuestGetOrders = () => {
  return useQuery({
    queryKey: ["guest-orders"],
    queryFn: guestApiRequest.getOrders,
  });
};
