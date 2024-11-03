import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDownNarrowWideIcon,
  ArrowUpNarrowWideIcon,
  ArrowUpDownIcon,
  ChevronDownIcon,
  Download,
  Settings2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DataTablePagination } from "@/components/data-table-pagination";
import { QueryResultsField } from "@/components/QueryResultsField";
import { KeyIcon, ColumnIcon } from "@/components/QueryResultsDecoration";

import { useStore } from "@/store/useStore";

export function QueryResultsTable({}) {
  const { toast } = useToast();
  const { queryResult } = useStore();
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<any>[]>(
    () =>
      queryResult?.columns?.map((col) => ({
        accessorKey: col,
        header: ({ column }) => {
          const columnInfo = queryResult?.structure?.find(
            (column) => column.name === col
          );
          return (
            <>
              <div
                className="flex items-center cursor-pointer"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
              >
                {{
                  asc: <ArrowUpNarrowWideIcon className="h-4 w-4" />,
                  desc: <ArrowDownNarrowWideIcon className="h-4 w-4" />,
                }[column.getIsSorted() as string] ?? (
                  <ArrowUpDownIcon className="h-4 w-4" />
                )}
              </div>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="flex cursor-pointer items-center space-x-1">
                    <span className="max-w-[200px] overflow-hidden truncate text-ellipsis whitespace-nowrap">
                      {col}
                    </span>
                    {columnInfo && <ColumnIcon column={columnInfo} />}
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="text-balance break-words bg-gray-100 dark:bg-gray-700">
                  <div className="mb-1 flex items-center space-x-1">
                    <p className="text-sm font-medium">{col}</p>
                    <KeyIcon column={columnInfo} />
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge className="block w-full self-start text-center text-xs font-semibold">
                      {columnInfo?.type_name || "Unknown"}
                    </Badge>
                    {columnInfo?.nullable && (
                      <Badge className="block w-full self-start text-center text-xs font-semibold">
                        NULLABLE
                      </Badge>
                    )}
                  </div>
                </HoverCardContent>
              </HoverCard>
            </>
          );
        },
        cell: ({ getValue }) => {
          const value = getValue();
          const columnInfo = queryResult?.structure?.find(
            (column) => column.name === col
          );
          return <QueryResultsField value={value} column={columnInfo} />;
        },
      })) || [],
    [queryResult?.columns]
  );

  const table = useReactTable({
    data: queryResult?.rows || [],
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (!queryResult || queryResult.rows?.length === 0) {
    return null;
  }

  const exportToCsv = () => {
    const visibleColumns = table
      .getAllColumns()
      .filter((column) => column.getIsVisible())
      .map((column) => column.id);

    const headers = visibleColumns.join(",");
    const rows = table
      .getRowModel()
      .rows.map((row) =>
        visibleColumns.map((col) => row.getValue(col)).join(",")
      )
      .join("\n");

    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "query-results.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded",
      description: "Query results exported to downloads folder",
    });
  };

  return (
    <div className="h-full py-4 bg-background">
      <div className="flex justify-end space-x-2 mb-4">
        <Button variant="outline" size="sm" onClick={exportToCsv}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings2 className="h-4 w-4 mr-2" />
              Columns
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mb-[20px] overflow-hidden rounded-lg border border-gray-200 dark:border dark:border-gray-700">
        <div className="overflow-x-auto">
          <div className="relative w-full overflow-auto">
            <Table className="w-full caption-bottom text-sm">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className={cn(
                          header.id === "id" ? "min-w-[50px]" : "min-w-[150px]"
                        )}
                      >
                        <div className="flex items-center gap-1">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </div>
                      </TableHead>
                    ))}
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
                        <TableCell
                          key={cell.id}
                          className="max-w-[200px] overflow-hidden text-ellipsis align-middle"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
