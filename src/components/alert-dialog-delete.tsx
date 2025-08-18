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

interface AlertDialogDeleteProps<T> {
  item: T | null;
  setItem: (value: T | null) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDelete: (item: T) => Promise<any>;
  title: string;
  description: (item: T) => React.ReactNode;
  loadingMessage: (item: T) => string;
  errorMessage: (item: T) => string;
  onSuccess?: () => void;
}

const AlertDialogDelete = <T,>({
  item,
  setItem,
  onDelete,
  title,
  description,
  loadingMessage,
  errorMessage,
  onSuccess,
}: AlertDialogDeleteProps<T>) => {
  const handleDelete = async () => {
    if (item) {
      const deletePromise = onDelete(item);

      toast.promise(deletePromise, {
        loading: loadingMessage(item),
        success: (result) => {
          onSuccess?.();
          setItem(null);
          return result.payload.message;
        },
        error: (error) => {
          handleErrorApi({ error });
          return errorMessage(item);
        },
      });
    }
  };

  return (
    <AlertDialog
      open={Boolean(item)}
      onOpenChange={(value) => {
        if (!value) {
          setItem(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {item && description(item)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Vẫn xoá</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogDelete;
