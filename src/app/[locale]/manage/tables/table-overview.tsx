"use client";

import { createContext, useState } from "react";
import EditTable from "@/app/[locale]/manage/tables/edit-table";
import AddTable from "@/app/[locale]/manage/tables/add-table";
import { columns } from "./columns";
import DataTable from "./data-table";
import { useDeleteTable, useTables } from "@/queries/useTable";
import { TableItem } from "@/constants/type";
import AlertDialogDelete from "@/components/alert-dialog-delete";

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

export default function TableOverview() {
  const [tableIdEdit, setTableIdEdit] = useState<number | undefined>();
  const [tableDelete, setTableDelete] = useState<TableItem | null>(null);

  const { data: tables, isLoading: tablesIsLoading } = useTables();
  const { mutateAsync } = useDeleteTable();
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

        <AlertDialogDelete
          item={tableDelete}
          setItem={setTableDelete}
          onDelete={(table) => mutateAsync(table.number)}
          title="Xóa bàn ăn?"
          description={(table) => (
            <>
              Bàn{" "}
              <span className="text-primary-foreground rounded">
                {table.number}
              </span>{" "}
              sẽ bị xóa vĩnh viễn
            </>
          )}
          loadingMessage={(table) => `Đang xoá bàn ăn số ${table.number}...`}
          errorMessage={(table) => `Lỗi khi xoá bàn ăn số ${table.number}`}
        />

        <DataTable columns={columns} data={data} />
      </div>
    </TableOverviewContext>
  );
}
