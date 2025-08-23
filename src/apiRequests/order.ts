import http from "@/lib/http";
import {
  GetOrderDetailResType,
  GetOrdersQueryParamsType,
  GetOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType,
} from "@/schemaValidations/order.schema";
import queryString from "query-string";

const prefix = "orders";

const orderApiRequest = {
  list: (queryParams: GetOrdersQueryParamsType) =>
    http.get<GetOrdersResType>(
      `${prefix}?${queryString.stringify({ fromDate: queryParams.fromDate?.toISOString(), toDate: queryParams.toDate?.toISOString() })}`,
    ),
  getOrderDetail: (id: number) =>
    http.get<GetOrderDetailResType>(`${prefix}/${id}`),
  updateOrder: (id: number, body: UpdateOrderBodyType) =>
    http.put<UpdateOrderResType>(`${prefix}/${id}`, body),
};

export default orderApiRequest;
