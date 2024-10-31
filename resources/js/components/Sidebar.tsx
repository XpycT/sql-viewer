import { useState } from 'react';
import { ChevronLeft, ChevronRight, Table } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const tables = [
  {
    name: 'users',
    columns: [
      { name: 'id', type: 'int' },
      { name: 'username', type: 'varchar(255)' },
      { name: 'email', type: 'varchar(255)' },
      { name: 'created_at', type: 'timestamp' },
    ],
  },
  {
    name: 'products',
    columns: [
      { name: 'id', type: 'int' },
      { name: 'name', type: 'varchar(255)' },
      { name: 'price', type: 'decimal(10,2)' },
      { name: 'category', type: 'varchar(100)' },
      { name: 'stock', type: 'int' },
    ],
  },
];

interface SidebarProps {
  onCollapsedChange: (collapsed: boolean) => void;
}

export function Sidebar({ onCollapsedChange }: SidebarProps) {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    onCollapsedChange(!isCollapsed);
  };

  const handleTableClick = (tableName: string) => {
    setExpanded(expanded.includes(tableName) ? [] : [tableName]);
  };

  return (
    <div className={cn(
      "fixed top-[4rem] left-0 h-[calc(100vh-4rem)] flex flex-col border-r bg-background transition-all duration-300",
      isCollapsed ? "w-[60px]" : "w-[250px]"
    )}>
      <div className="flex-1 overflow-auto">
        {isCollapsed ? (
          <div className="py-4">
            {tables.map((table) => (
              <div
                key={table.name}
                className={cn(
                  "flex justify-center py-2 px-2 hover:bg-accent cursor-pointer",
                  expanded.includes(table.name) && "bg-accent"
                )}
                title={table.name}
                onClick={() => handleTableClick(table.name)}
              >
                <Table className="h-4 w-4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4">
            <Accordion
              type="single"
              collapsible
              value={expanded[0]}
              onValueChange={(value) => setExpanded(value ? [value] : [])}
            >
              {tables.map((table) => (
                <AccordionItem key={table.name} value={table.name}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Table className="h-4 w-4" />
                      <span>{table.name}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="pl-6 space-y-1">
                      {table.columns.map((column) => (
                        <li key={column.name} className="text-sm py-1 px-2 rounded hover:bg-accent">
                          <span>{column.name}</span>
                          <span className="text-muted-foreground ml-1">({column.type})</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
      <div className="p-2 border-t">
        <Button
          variant="ghost"
          size="icon"
          className="w-full"
          onClick={handleCollapse}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}