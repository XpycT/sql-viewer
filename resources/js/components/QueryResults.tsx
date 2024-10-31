import { useState, useMemo, useEffect } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, Download, Settings2, Eye, EyeOff } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QueryResultsField } from './QueryResultsField';

interface QueryResultsProps {
  results: {
    columns: string[];
    rows: any[];
  };
}

export function QueryResults({ results }: QueryResultsProps) {
  const { toast } = useToast();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [hiddenFields, setHiddenFields] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initHiddenFields = results?.columns.reduce((acc, col) => {
      const shouldBeHidden = window.sqlViewerConfig?.hiddenFields?.includes(col.toLowerCase());
      if (shouldBeHidden) {
        acc[col] = true;
      }
      return acc;
    }, {} as Record<string, boolean>);

    setHiddenFields(initHiddenFields || {});
  }, [results?.columns]);

  const columns = useMemo<ColumnDef<any>[]>(
    () =>
      results?.columns.map((col) => ({
        accessorKey: col,
        header: ({ column }) => {
          return (
              <div
                className="flex items-center justify-between space-x-2"
              >
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                  <span>{col}</span>
                  {{
                    asc: <ArrowUp className="h-4 w-4" />,
                    desc: <ArrowDown className="h-4 w-4" />,
                  }[column.getIsSorted() as string] ?? null}
                </div>
              </div>
          );
        },
        cell: ({ getValue }) => {
          const value = getValue();
          return (
            <div className="flex items-center justify-between">
                <QueryResultsField value={value} isHidden={hiddenFields[col]} />
            </div>
          );
        },
      })) || [],
    [results?.columns, hiddenFields]
  );

  const table = useReactTable({
    data: results?.rows || [],
    columns,
    state: {
      sorting,
      columnVisibility: hiddenFields,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setHiddenFields,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (!results) {
    return null;
  }

  const exportToCsv = () => {
    const visibleColumns = table.getAllColumns()
      .filter(column => column.getIsVisible())
      .map(column => column.id);

    const headers = visibleColumns.join(',');
    const rows = table.getRowModel().rows
      .map((row) =>
        visibleColumns
          .map((col) => row.getValue(col))
          .join(',')
      )
      .join('\n');

    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query-results.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: 'Downloaded',
      description: 'Query results exported to downloads folder',
    });
  };

  return (
    <div className="h-full p-4 bg-background">
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
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {table.getAllColumns().map((column) => (
              <div key={column.id} className="flex items-center space-x-2 p-2">
                <Checkbox
                  id={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                />
                <label htmlFor={column.id} className="text-sm font-medium">
                  {column.id}
                </label>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <ScrollArea>
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-muted">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2 text-left font-medium text-muted-foreground cursor-pointer hover:bg-accent"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t hover:bg-muted/50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
