"use client";

import { GetOrdersResType } from "@/schemaValidations/order.schema";
import { createContext, use, useState } from "react";
import { OrderStatusValues } from "@/constants/type";
import orderTableColumns from "@/app/manage/orders/order-table-columns";
import { useOrderService } from "@/app/manage/orders/order.service";
import OrderDataTable from "./order-data-table";
import { useGetOrders } from "@/queries/useOrder";
import { endOfDay, startOfDay } from "date-fns";
import { useTables } from "@/queries/useTable";

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
  ordersIsLoading: boolean
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
  ordersIsLoading: false
});

export const useOrderTableContext = () => {
  const context = use(OrderTableContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

const initFromDate = startOfDay(new Date());
const initToDate = endOfDay(new Date());

export default function OrderTable() {
  const [orderIdEdit, setOrderIdEdit] = useState<number | undefined>();
  const [fromDate, setFromDate] = useState(initFromDate);
  const [toDate, setToDate] = useState(initToDate);

  const { data: orders, isLoading: ordersIsLoading } = useGetOrders({ fromDate, toDate });
  const { data: tables } = useTables();

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
  }) => {};

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
        ordersIsLoading
      }}
    >
      <OrderDataTable columns={orderTableColumns} data={orderList} />
    </OrderTableContext>
  );
}
