import QRCodeTable from "@/components/qrcode-table";
import { Button } from "@/components/ui/button";
import { getVietnameseTableStatus } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { use } from "react";
import { TableOverviewContext } from "./table-overview";
import { TableItem } from "@/constants/type";

export const columns: ColumnDef<TableItem>[] = [
  {
    accessorKey: "number",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="cursor-pointer w-full"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Số bàn
        <CaretSortIcon className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("number")}</div>
    ),
    filterFn: (row, columnId, filterValue) => {
      return !filterValue
        ? true
        : String(filterValue) === String(row.getValue("number"));
    },
  },
  {
    accessorKey: "capacity",
    header: () => <div className="text-center">Sức chứa</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("capacity")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Trạng thái</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {getVietnameseTableStatus(row.getValue("status"))}
      </div>
    ),
  },
  {
    accessorKey: "token",
    header: () => <div className="text-center">QR Code</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <QRCodeTable
          key={row.getValue("number")}
          token={row.getValue("token")}
          tableNumber={row.getValue("number")}
        />
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setTableIdEdit, setTableDelete } = use(TableOverviewContext);
      const openEditTable = () => {
        setTableIdEdit(row.original.number);
      };

      const openDeleteTable = () => {
        setTableDelete(row.original);
      };
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openEditTable}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteTable}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
