"use client";

import { createContext, useState } from "react";
import EditDish from "@/app/[locale]/manage/dishes/edit-dish";
import AddDish from "@/app/[locale]/manage/dishes/add-dish";
import { useDeleteDish, useDishes } from "@/queries/useDish";
import { DishItem } from "@/constants/type";
import AlertDialogDelete from "@/components/alert-dialog-delete";
import { columns } from "./columns";
import DataTable from "./data-table";
import revalidateApiRequest from "@/apiRequests/revalidate";

export const DishTableContext = createContext<{
  setDishIdEdit: (value: number) => void;
  dishIdEdit: number | undefined;
  dishDelete: DishItem | null;
  setDishDelete: (value: DishItem | null) => void;
}>({
  setDishIdEdit: () => {},
  dishIdEdit: undefined,
  dishDelete: null,
  setDishDelete: () => {},
});

export default function DishTable() {
  const [dishIdEdit, setDishIdEdit] = useState<number | undefined>();
  const [dishDelete, setDishDelete] = useState<DishItem | null>(null);

  const { data: dishes, isLoading: dishesIsLoading } = useDishes();
  const { mutateAsync } = useDeleteDish();

  const data = dishes?.payload.data ?? [];

  if (dishesIsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Chưa có món ăn nào</h3>
          <p className="text-muted-foreground">Thêm món ăn đầu tiên</p>
        </div>
        <AddDish />
      </div>
    );
  }

  return (
    <DishTableContext
      value={{ dishIdEdit, setDishIdEdit, dishDelete, setDishDelete }}
    >
      <div className="w-full">
        <EditDish id={dishIdEdit} setId={setDishIdEdit} />

        <AlertDialogDelete
          item={dishDelete}
          setItem={setDishDelete}
          onDelete={(dish) => mutateAsync(dish.id)}
          title="Xóa món ăn?"
          description={(dish) => (
            <>
              Món{" "}
              <span className="text-primary-foreground rounded">
                {dish.name}
              </span>{" "}
              sẽ bị xóa vĩnh viễn
            </>
          )}
          loadingMessage={(dish) => `Đang xoá món ăn số ${dish.id}...`}
          errorMessage={(dish) => `Lỗi khi xoá món ăn số ${dish.id}`}
          onSuccess={async () => await revalidateApiRequest("dishes")}
        />

        <DataTable columns={columns} data={data} />
      </div>
    </DishTableContext>
  );
}
