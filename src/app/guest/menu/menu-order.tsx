"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useDishes } from "@/queries/useDish";
import { formatCurrency } from "@/lib/utils";
import Quantity from "./quantity";
import { useState } from "react";
import { GuestCreateOrdersBodyType } from "@/schemaValidations/guest.schema";

const MenuOrder = () => {
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([]);

  const { data } = useDishes();
  const dishes = data?.payload.data ?? [];

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

  return (
    <>
      {dishes.map((dish) => (
        <div key={dish.id} className="flex gap-4">
          <div className="flex-shrink-0">
            <Image
              src={dish.image ?? ""}
              alt={dish.name}
              height={100}
              width={100}
              quality={100}
              priority
              className="h-[80px] w-[80px] rounded-md object-cover"
            />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm">{dish.name}</h3>
            <p className="text-xs">{dish.description}</p>
            <p className="text-xs font-semibold">
              {formatCurrency(dish.price)} VNĐ
            </p>
          </div>

          <div className="ml-auto flex flex-shrink-0 items-center justify-center">
            <Quantity
              onChange={(value) => handleQuantityChange(dish.id, value)}
              value={
                orders.find((order) => order.dishId === dish.id)?.quantity ?? 0
              }
            />
          </div>
        </div>
      ))}

      <div className="sticky bottom-0">
        <Button className="w-full justify-between">
          <span>Giỏ hàng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)} VNĐ</span>
        </Button>
      </div>
    </>
  );
};
export default MenuOrder;
