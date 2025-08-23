"use client";

import { OrderStatus } from "@/constants/type";
import socket from "@/lib/socket";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useGuestGetOrders } from "@/queries/useGuest";
import { UpdateOrderResType } from "@/schemaValidations/order.schema";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "sonner";

const OrdersCart = () => {
  const { data, refetch } = useGuestGetOrders();
  const orders = data?.payload.data ?? [];

  const totalPrice = orders.reduce((sum, order) => {
    if (!["Rejected", "Paid"].includes(order.status)) {
      return sum + (order?.dishSnapshot.price ?? 0) * order.quantity;
    }
    return sum;
  }, 0);

  const orderItemsCount = orders.filter(order =>
    !["Rejected", "Paid"].includes(order.status)
  ).length;

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log(socket.id);
    }

    function onDisconnect() {
      console.log("disconnected");
    }

    function onUpdateOrder(data: UpdateOrderResType["data"]) {
      const {
        dishSnapshot: { name },
        quantity,
        status,
      } = data;
      toast.success(
        `Món ${name} (SL: ${quantity}) vừa được cập nhật. Trạng Thái: ${getVietnameseOrderStatus(status)}`,
      );
      refetch();
    }

    socket.on("update-order", onUpdateOrder);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("update-order", onUpdateOrder);
    };
  }, [refetch]);

  return (
    <>
      {orders.map((order) => (
        <div key={order.id} className="flex gap-4">
          <div className="relative flex-shrink-0 overflow-hidden rounded-md">
            <Image
              src={order.dishSnapshot.image ?? ""}
              alt={order.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              priority
              className="h-[80px] w-[80px] object-cover"
            />
          </div>

          <div className="w-full max-w-[150px] space-y-1">
            <h3 className="text-sm">{order.dishSnapshot.name}</h3>
            <div className="flex w-full max-w-[100px] items-center justify-between">
              <span className="text-xs text-gray-600">
                {formatCurrency(order.dishSnapshot.price)} VNĐ
              </span>
              <span className="text-xs font-medium text-gray-500">
                x {order.quantity}
              </span>
            </div>
            <p className="text-sm font-semibold text-orange-600">
              {formatCurrency(order.dishSnapshot.price * order.quantity)} VNĐ
            </p>
          </div>

          <div className="ml-auto flex flex-shrink-0 items-center justify-center">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                order.status === OrderStatus.Pending
                  ? "bg-yellow-100 text-yellow-800"
                  : order.status === OrderStatus.Processing
                    ? "bg-blue-100 text-blue-800"
                    : order.status === OrderStatus.Delivered
                      ? "bg-green-100 text-green-800"
                      : order.status === OrderStatus.Paid
                        ? "bg-green-100 text-green-600"
                        : order.status === OrderStatus.Rejected
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
              }`}
            >
              {getVietnameseOrderStatus(order.status)}
            </span>
          </div>
        </div>
      ))}
      <div className="bg-primary sticky bottom-3 rounded-lg p-1 shadow-md">
        <div className="flex w-full flex-col items-center justify-between">
          <span className="text-primary-foreground text-sm font-medium">
            Số tiền thanh toán · {orderItemsCount} món
          </span>
          <span className="text-primary-foreground text-lg font-bold">
            {formatCurrency(totalPrice)} VNĐ
          </span>
        </div>
      </div>
    </>
  );
};
export default OrdersCart;
