"use client";

import { createContext, useState } from "react";
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
import { handleErrorApi } from "@/lib/utils";
import EditTable from "@/app/manage/tables/edit-table";
import AddTable from "@/app/manage/tables/add-table";
import { useDeleteTable, useTables } from "@/queries/useTable";
import { toast } from "sonner";
import { columns, TableItem } from "./columns";
import DataTable from "./data-table";

export const TableOverviewContext = createContext<{
  setTableIdEdit: (value: number) => void;
  tableIdEdit: number | undefined;
  tableDelete: TableItem | null;
  setTableDelete: (value: TableItem | null) => void;
}>({
  setTableIdEdit: () => {},
  tableIdEdit: undefined,
  tableDelete: null,
  setTableDelete: () => {},
});

function AlertDialogDeleteTable({
  tableDelete,
  setTableDelete,
}: {
  tableDelete: TableItem | null;
  setTableDelete: (value: TableItem | null) => void;
}) {
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
}

export default function TableOverview() {
  const [tableIdEdit, setTableIdEdit] = useState<number | undefined>();
  const [tableDelete, setTableDelete] = useState<TableItem | null>(null);
  const { data: tables, isLoading: tablesIsLoading } = useTables();
  const data = tables?.payload.data ?? [];

  if (tablesIsLoading) {
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
          <h3 className="text-lg font-semibold">Chưa có bàn ăn nào</h3>
          <p className="text-muted-foreground">Thêm bàn ăn đầu tiên</p>
        </div>
        <AddTable />
      </div>
    );
  }

  return (
    <TableOverviewContext
      value={{ tableIdEdit, setTableIdEdit, tableDelete, setTableDelete }}
    >
      <div className="w-full">
        <EditTable id={tableIdEdit} setId={setTableIdEdit} />
        <AlertDialogDeleteTable
          tableDelete={tableDelete}
          setTableDelete={setTableDelete}
        />

        <DataTable columns={columns} data={data} />

      </div>
    </TableOverviewContext>
  );
}
