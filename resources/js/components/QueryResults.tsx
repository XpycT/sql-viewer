import { useState, useMemo } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, Download, Settings2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

// Mock data for demonstration
const mockData = {
  columns: ['id', 'username', 'email', 'created_at'],
  rows: [
    { id: 1, username: 'john_doe', email: 'john@example.com', created_at: '2024-02-28' },
    { id: 2, username: 'jane_smith', email: 'jane@example.com', created_at: '2024-02-27' },
    { id: 3, username: 'bob_wilson', email: 'bob@example.com', created_at: '2024-02-26' },
    { id: 4, username: 'alice_brown', email: 'alice@example.com', created_at: '2024-02-25' },
    { id: 5, username: 'charlie_davis', email: 'charlie@example.com', created_at: '2024-02-24' },
  ],
};

type Row = typeof mockData.rows[0];

export function QueryResults() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const columns = useMemo<ColumnDef<Row>[]>(
    () =>
      mockData.columns.map((col) => ({
        accessorKey: col,
        header: ({ column }) => {
          return (
            <div
              className="flex items-center space-x-2"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              <span>{col}</span>
              {{
                asc: <ArrowUp className="h-4 w-4" />,
                desc: <ArrowDown className="h-4 w-4" />,
              }[column.getIsSorted() as string] ?? null}
            </div>
          );
        },
      })),
    []
  );

  const table = useReactTable({
    data: mockData.rows,
    columns,
    state: {
      sorting,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

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