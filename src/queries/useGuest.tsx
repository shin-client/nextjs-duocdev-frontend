import guestApiRequest from "@/apiRequests/guest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: guestApiRequest.orders,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["guest-orders"],
      });
    },
  });
};

export const useGuestGetOrders = () => {
  return useQuery({
    queryKey: ["guest-orders"],
    queryFn: guestApiRequest.getOrders,
  });
};
