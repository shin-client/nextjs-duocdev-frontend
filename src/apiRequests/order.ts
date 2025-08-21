import http from "@/lib/http";
import {
  GetOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType,
} from "@/schemaValidations/order.schema";

const prefix = "orders";

const orderApiRequest = {
  list: () => http.get<GetOrdersResType>(prefix),
  updateOrder: (id: number, body: UpdateOrderBodyType) =>
    http.put<UpdateOrderResType>(`${prefix}/${id}`, body),
};

export default orderApiRequest;
