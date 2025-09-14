"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useDishes } from "@/queries/useDish";
import { cn, formatCurrency, handleErrorApi } from "@/lib/utils";
import Quantity from "./quantity";
import { useState } from "react";
import { GuestCreateOrdersBodyType } from "@/schemaValidations/guest.schema";
import { useGuestOrder } from "@/queries/useGuest";
import { useRouter } from "next/navigation";
import { DishStatus } from "@/constants/type";

const MenuOrder = () => {
  const router = useRouter();

  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([]);

  const { data } = useDishes();
  const dishes = data?.payload.data ?? [];
  const { isPending, mutateAsync: guestOrder } = useGuestOrder();

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prevOrders) => {
      if (quantity === 0)
        return prevOrders.filter((order) => order.dishId !== dishId);

      const index = prevOrders.findIndex((order) => order.dishId == dishId);

      if (index === -1) return [...prevOrders, { dishId, quantity }];

      const newOrders = [...prevOrders];
      newOrders[index] = { ...newOrders[index], quantity };
      return newOrders;
    });
  };

  const totalPrice = orders.reduce((sum, order) => {
    const dish = dishes.find((d) => d.id === order.dishId);
    return sum + (dish?.price ?? 0) * order.quantity;
  }, 0);

  const handleOrder = async () => {
    try {
      await guestOrder(orders);
      router.push("/guest/orders");
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  return (
    <>
      {dishes
        .filter((dish) => dish.status !== DishStatus.Hidden)
        .map((dish) => (
          <div key={dish.id} className="flex gap-4">
            <div className="relative flex-shrink-0 overflow-hidden rounded-md">
              {dish.status === DishStatus.Unavailable && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white shadow-lg">
                    Đã hết
                  </span>
                </div>
              )}
              <Image
                src={dish.image ?? ""}
                alt={dish.name}
                height={100}
                width={100}
                quality={100}
                priority
                className="h-[80px] w-[80px] object-cover"
              />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm">{dish.name}</h3>
              <p className="text-xs">{dish.description}</p>
              <p className="text-xs font-semibold text-orange-600">
                {formatCurrency(dish.price)} VNĐ
              </p>
            </div>

            <div
              className={cn(
                "ml-auto flex flex-shrink-0 items-center justify-center",
                { hidden: dish.status === DishStatus.Unavailable },
              )}
            >
              <Quantity
                onChange={(value) => handleQuantityChange(dish.id, value)}
                value={
                  orders.find((order) => order.dishId === dish.id)?.quantity ??
                  0
                }
              />
            </div>
          </div>
        ))}

      <div className="sticky bottom-3">
        <Button
          className="w-full justify-between"
          onClick={handleOrder}
          disabled={orders.length === 0}
          isLoading={isPending}
        >
          <span>Gọi món · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)} VNĐ</span>
        </Button>
      </div>
    </>
  );
};
export default MenuOrder;
