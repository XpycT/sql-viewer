import { useState, useMemo, useEffect } from "react";
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
  ArrowDown,
  ArrowUp,
  Download,
  Settings2,
  ChevronDownIcon,
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DataTablePagination } from "./data-table-pagination";
import { QueryResultsField } from "./QueryResultsField";
import { CaretSortIcon } from "@radix-ui/react-icons";

interface QueryResultsProps {
  results: {
    columns: string[];
    rows: any[];
  };
}

export function QueryResults({ results }: QueryResultsProps) {
  const { toast } = useToast();
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<any>[]>(
    () =>
      results?.columns.map((col) => ({
        accessorKey: col,
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              className="flex items-center -ml-3 h-8"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <span>{col}</span>
              {{
                asc: <ArrowUp className="ml-2 h-4 w-4" />,
                desc: <ArrowDown className="ml-2 h-4 w-4" />,
              }[column.getIsSorted() as string] ?? (
                <CaretSortIcon className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },
        cell: ({ getValue }) => {
          const value = getValue();
          return (
            <div className="flex items-center justify-between">
                <span title={value} className="text-ellipsis overflow-hidden max-w-[300px]">{value}</span>
            </div>
          );
        },
      })) || [],
    [results?.columns]
  );

  const table = useReactTable({
    data: results?.rows || [],
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (!results || results.rows.length === 0) {
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

      <Table className="w-full">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
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
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />

    </div>
  );
}
