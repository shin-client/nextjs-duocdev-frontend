"use client";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AutoPagination from "@/components/auto-pagination";
import { Button } from "@/components/ui/button";
import AddOrder from "@/app/manage/orders/add-order";
import EditOrder from "@/app/manage/orders/edit-order";
import { format } from "date-fns";
import { getVietnameseOrderStatus, cn } from "@/lib/utils";
import OrderStatics from "@/app/manage/orders/order-statics";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useOrderTableContext } from "./order-table";
import { OrderStatusValues } from "@/constants/type";
import { useOrderService } from "./order.service";
import TableSkeleton from "./table-skeleton";

interface OrderDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const PAGE_SIZE = 10;

const OrderDataTable = <TData, TValue>({
  columns,
  data,
}: OrderDataTableProps<TData, TValue>) => {
  const searchParam = useSearchParams();
  const {
    orderIdEdit,
    setOrderIdEdit,
    fromDate,
    toDate,
    setFromDate,
    setToDate,
    resetDateFilter,
    tableListSortedByNumber,
    ordersIsLoading,
  } = useOrderTableContext();
  const { statics, servingGuestByTableNumber } =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useOrderService(data as any);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const [openStatusFilter, setOpenStatusFilter] = useState(false);

  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const pageIndex = page - 1;
  const [pagination, setPagination] = useState({
    pageIndex,
    pageSize: PAGE_SIZE,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE,
    });
  }, [table, pageIndex]);

  return (
    <div className="w-full">
      <EditOrder
        id={orderIdEdit}
        setId={setOrderIdEdit}
        onSubmitSuccess={() => {}}
      />

      <div className="flex items-center">
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center">
            <span className="mr-2">Từ</span>
            <Input
              type="datetime-local"
              placeholder="Từ ngày"
              className="text-sm"
              value={format(fromDate, "yyyy-MM-dd HH:mm").replace(" ", "T")}
              onChange={(event) => setFromDate(new Date(event.target.value))}
            />
          </div>
          <div className="flex items-center">
            <span className="mr-2">Đến</span>
            <Input
              type="datetime-local"
              placeholder="Đến ngày"
              value={format(toDate, "yyyy-MM-dd HH:mm").replace(" ", "T")}
              onChange={(event) => setToDate(new Date(event.target.value))}
            />
          </div>
          <Button className="" variant={"outline"} onClick={resetDateFilter}>
            Reset
          </Button>
        </div>
        <div className="ml-auto">
          <AddOrder />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 py-4">
        <Input
          placeholder="Tên khách"
          value={
            (table.getColumn("guestName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("guestName")?.setFilterValue(event.target.value)
          }
          className="max-w-[100px]"
        />
        <Input
          placeholder="Số bàn"
          value={
            (table.getColumn("tableNumber")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("tableNumber")?.setFilterValue(event.target.value)
          }
          className="max-w-[80px]"
        />
        <Popover open={openStatusFilter} onOpenChange={setOpenStatusFilter}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openStatusFilter}
              className="w-[150px] justify-between text-sm"
            >
              {table.getColumn("status")?.getFilterValue()
                ? getVietnameseOrderStatus(
                    table
                      .getColumn("status")
                      ?.getFilterValue() as (typeof OrderStatusValues)[number],
                  )
                : "Trạng thái"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandGroup>
                <CommandList>
                  {OrderStatusValues.map((status) => (
                    <CommandItem
                      key={status}
                      value={status}
                      onSelect={(currentValue) => {
                        table
                          .getColumn("status")
                          ?.setFilterValue(
                            currentValue ===
                              table.getColumn("status")?.getFilterValue()
                              ? ""
                              : currentValue,
                          );
                        setOpenStatusFilter(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          table.getColumn("status")?.getFilterValue() === status
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {getVietnameseOrderStatus(status)}
                    </CommandItem>
                  ))}
                </CommandList>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <OrderStatics
        statics={statics}
        tableList={tableListSortedByNumber}
        servingGuestByTableNumber={servingGuestByTableNumber}
      />

      {ordersIsLoading ? (
        <TableSkeleton />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <div className="space-y-2 py-4 text-center">
                      <p>Không tìm thấy kết quả với bộ lọc hiện tại</p>
                      <Button onClick={() => table.resetColumnFilters()}>
                        Xóa bộ lọc
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 py-4 text-xs">
          Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong>{" "}
          trong <strong>{data.length}</strong> kết quả
        </div>
        <div>
          <AutoPagination
            page={table.getState().pagination.pageIndex + 1}
            pageSize={table.getPageCount()}
            isLink={false}
            onClick={(pageNumber) =>
              table.setPagination({
                pageIndex: pageNumber - 1,
                pageSize: PAGE_SIZE,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};
export default OrderDataTable;
