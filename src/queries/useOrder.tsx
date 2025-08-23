import orderApiRequest from "@/apiRequests/order";
import { GetOrdersQueryParamsType, UpdateOrderBodyType } from "@/schemaValidations/order.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetOrders = (queryParams: GetOrdersQueryParamsType) => {
  return useQuery({
    queryKey: ["orders", queryParams],
    queryFn: () => orderApiRequest.list(queryParams),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetOrderDetail = (id: number) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => orderApiRequest.getOrderDetail(id),
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export const useUpdateOrder = () => {
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateOrderBodyType & { id: number }) =>
      orderApiRequest.updateOrder(id, body),
  });
};