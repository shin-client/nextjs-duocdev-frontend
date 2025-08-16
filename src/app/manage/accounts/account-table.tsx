"use client";

import AddEmployee from "@/app/manage/accounts/add-employee";
import EditEmployee from "@/app/manage/accounts/edit-employee";
import { createContext, useState } from "react";
import {
  useDeleteAccountMutation,
  useGetAccountList,
} from "@/queries/useAccount";
import { columns } from "./columns";
import AlertDialogDelete from "@/components/alert-dialog-delete";
import DataTable from "./data-table";
import { AccountItem } from "@/constants/type";

export const AccountTableContext = createContext<{
  employeeIdEdit: number | undefined;
  employeeDelete: AccountItem | null;
  setEmployeeIdEdit: (value: number) => void;
  setEmployeeDelete: (value: AccountItem | null) => void;
}>({
  employeeIdEdit: undefined,
  employeeDelete: null,
  setEmployeeIdEdit: () => {},
  setEmployeeDelete: () => {},
});

export default function AccountTable() {
  const [employeeIdEdit, setEmployeeIdEdit] = useState<number | undefined>();
  const [employeeDelete, setEmployeeDelete] = useState<AccountItem | null>(
    null,
  );

  const accountListQuery = useGetAccountList();
  const { mutateAsync } = useDeleteAccountMutation();
  const data = accountListQuery.data?.payload.data ?? [];

  if (accountListQuery.isLoading) {
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
          <h3 className="text-lg font-semibold">Chưa có nhân viên nào</h3>
          <p className="text-muted-foreground">Thêm nhân viên đầu tiên</p>
        </div>
        <AddEmployee />
      </div>
    );
  }

  return (
    <AccountTableContext
      value={{
        employeeIdEdit,
        setEmployeeIdEdit,
        employeeDelete,
        setEmployeeDelete,
      }}
    >
      <div className="w-full">
        <EditEmployee
          id={employeeIdEdit}
          setId={setEmployeeIdEdit}
          onSubmitSuccess={() => {}}
        />

        <AlertDialogDelete
          item={employeeDelete}
          setItem={setEmployeeDelete}
          onDelete={(empolyee) => mutateAsync(empolyee.id)}
          title={"Xóa nhân viên?"}
          description={(empolyee) => (
            <>
              Tài khoản{" "}
              <span className="text-primary-foreground rounded">
                {empolyee?.name}
              </span>{" "}
              sẽ bị xóa vĩnh viễn
            </>
          )}
          loadingMessage={(employee) =>
            `Đang xoá nhân viên ${employee.name}...`
          }
          errorMessage={(employee) => `Lỗi khi xoá nhân viên ${employee.name}`}
        />

        <DataTable columns={columns} data={data} />
      </div>
    </AccountTableContext>
  );
}
