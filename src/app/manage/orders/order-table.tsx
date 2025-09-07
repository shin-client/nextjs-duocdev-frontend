"use client";

import {
  GetOrdersResType,
  PayGuestOrdersResType,
  UpdateOrderResType,
} from "@/schemaValidations/order.schema";
import { createContext, use, useEffect, useState } from "react";
import { OrderStatusValues } from "@/constants/type";
import orderTableColumns from "@/app/manage/orders/order-table-columns";
import { useOrderService } from "@/app/manage/orders/order.service";
import OrderDataTable from "./order-data-table";
import { useGetOrders, useUpdateOrder } from "@/queries/useOrder";
import { endOfDay, startOfDay } from "date-fns";
import { useTables } from "@/queries/useTable";
import { toast } from "sonner";
import { getVietnameseOrderStatus, handleErrorApi } from "@/lib/utils";
import { GuestCreateOrdersResType } from "@/schemaValidations/guest.schema";
import { useAppStore } from "@/components/app-provider";

export type StatusCountObject = Record<
  (typeof OrderStatusValues)[number],
  number
>;
export type Statics = {
  status: StatusCountObject;
  table: Record<number, Record<number, StatusCountObject>>;
};
export type OrderObjectByGuestID = Record<number, GetOrdersResType["data"]>;
export type ServingGuestByTableNumber = Record<number, OrderObjectByGuestID>;

export const OrderTableContext = createContext<{
  setOrderIdEdit: (value: number | undefined) => void;
  orderIdEdit: number | undefined;
  changeStatus: (payload: {
    orderId: number;
    dishId: number;
    status: (typeof OrderStatusValues)[number];
    quantity: number;
  }) => void;
  orderObjectByGuestId: OrderObjectByGuestID;
  fromDate: Date;
  toDate: Date;
  setFromDate: (date: Date) => void;
  setToDate: (date: Date) => void;
  resetDateFilter: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableListSortedByNumber: any[];
  ordersIsLoading: boolean;
}>({
  setOrderIdEdit: () => {},
  orderIdEdit: undefined,
  changeStatus: () => {},
  orderObjectByGuestId: {},
  fromDate: new Date(),
  toDate: new Date(),
  setFromDate: () => {},
  setToDate: () => {},
  resetDateFilter: () => {},
  tableListSortedByNumber: [],
  ordersIsLoading: false,
});

export const useOrderTableContext = () => {
  const context = use(OrderTableContext);
  if (context === undefined) {
    throw new Error("useOrderTableContext must be used within an AppProvider");
  }
  return context;
};

const initFromDate = startOfDay(new Date());
const initToDate = endOfDay(new Date());

export default function OrderTable() {
  const [orderIdEdit, setOrderIdEdit] = useState<number | undefined>();
  const [fromDate, setFromDate] = useState(initFromDate);
  const [toDate, setToDate] = useState(initToDate);

  const { socket } = useAppStore();
  const {
    data: orders,
    isLoading: ordersIsLoading,
    refetch,
  } = useGetOrders({
    fromDate,
    toDate,
  });
  const { data: tables } = useTables();
  const { mutateAsync: updateOrder } = useUpdateOrder();

  const orderList = orders?.payload.data ?? [];
  const tableList = tables?.payload.data ?? [];
  const tableListSortedByNumber = tableList.sort((a, b) => a.number - b.number);

  const { orderObjectByGuestId } = useOrderService(orderList);

  const resetDateFilter = () => {
    setFromDate(initFromDate);
    setToDate(initToDate);
  };

  const changeStatus = async (body: {
    orderId: number;
    dishId: number;
    status: (typeof OrderStatusValues)[number];
    quantity: number;
  }) => {
    try {
      await updateOrder(body);
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  useEffect(() => {
    function ordersRefetch() {
      const now = new Date();
      if (now <= toDate && now >= fromDate) return refetch();
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
      ordersRefetch();
    }

    function onNewOrder(data: GuestCreateOrdersResType["data"]) {
      const { guest } = data[0];
      toast.success(
        `Khách ${guest?.name} tại bàn ${guest?.tableNumber} vừa gọi ${data.length} món`,
      );
      ordersRefetch();
    }

    function onPayment(data: PayGuestOrdersResType["data"]) {
      const { guest } = data[0];
      toast.success(
        `Khách ${guest?.name} tại bàn ${guest?.tableNumber} thanh toán thành công ${data.length} món`,
      );
      ordersRefetch();
    }

    socket?.on("update-order", onUpdateOrder);
    socket?.on("new-order", onNewOrder);
    socket?.on("payment", onPayment);

    return () => {
      socket?.off("update-order", onUpdateOrder);
      socket?.off("new-order", onNewOrder);
      socket?.off("payment", onPayment);
    };
  }, [fromDate, refetch, socket, toDate]);

  return (
    <OrderTableContext
      value={{
        orderIdEdit,
        setOrderIdEdit,
        changeStatus,
        orderObjectByGuestId,
        fromDate,
        toDate,
        setFromDate,
        setToDate,
        resetDateFilter,
        tableListSortedByNumber,
        ordersIsLoading,
      }}
    >
      <OrderDataTable columns={orderTableColumns} data={orderList} />
    </OrderTableContext>
  );
}
