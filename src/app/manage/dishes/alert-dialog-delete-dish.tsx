import { useDeleteDish } from "@/queries/useDish";
import { toast } from "sonner";
import { handleErrorApi } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DishItem } from "@/constants/type";

const AlertDialogDeleteDish = ({
  dishDelete,
  setDishDelete,
}: {
  dishDelete: DishItem | null;
  setDishDelete: (value: DishItem | null) => void;
}) => {
  const { mutateAsync } = useDeleteDish();

  const deleteDish = async () => {
    if (dishDelete) {
      const deletePromise = mutateAsync(dishDelete.id);

      toast.promise(deletePromise, {
        loading: `Đang xoá món ăn số ${dishDelete.id}...`,
        success: (result) => {
          setDishDelete(null);
          return result.payload.message;
        },
        error: (error) => {
          handleErrorApi({ error });
          return `Lỗi khi xoá món ăn số ${dishDelete.id}`;
        },
      });
    }
  };
  return (
    <AlertDialog
      open={Boolean(dishDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setDishDelete(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa món ăn?</AlertDialogTitle>
          <AlertDialogDescription>
            Món{" "}
            <span className="text-primary-foreground rounded">
              {dishDelete?.name}
            </span>{" "}
            sẽ bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
          <AlertDialogAction onClick={deleteDish}>Vẫn xoá</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogDeleteDish;
