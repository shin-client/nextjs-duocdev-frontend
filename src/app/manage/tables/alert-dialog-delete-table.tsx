import { useDeleteTable } from "@/queries/useTable";
import { TableItem } from "./columns";
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

const AlertDialogDeleteTable = ({
  tableDelete,
  setTableDelete,
}: {
  tableDelete: TableItem | null;
  setTableDelete: (value: TableItem | null) => void;
}) => {
  const { mutateAsync } = useDeleteTable();

  const deleteTable = async () => {
    if (tableDelete) {
      const deletePromise = mutateAsync(tableDelete.number);

      toast.promise(deletePromise, {
        loading: `Đang xoá bàn ăn số ${tableDelete.number}...`,
        success: (result) => {
          setTableDelete(null);
          return result.payload.message;
        },
        error: (error) => {
          handleErrorApi({ error });
          return `Lỗi khi xoá bàn ăn số ${tableDelete.number}`;
        },
      });
    }
  };

  return (
    <AlertDialog
      open={Boolean(tableDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setTableDelete(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa bàn ăn?</AlertDialogTitle>
          <AlertDialogDescription>
            Bàn{" "}
            <span className="text-primary-foreground rounded">
              {tableDelete?.number}
            </span>{" "}
            sẽ bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
          <AlertDialogAction onClick={deleteTable}>Vẫn xoá</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogDeleteTable;
