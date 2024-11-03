import { useState, useEffect, ComponentProps } from 'react';
import {  DatabaseIcon } from "lucide-react"

import { NavMain } from "@/components/NavMain"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { fetchTables } from '@/api';
import { Table } from '@/types/table';

export function AppSidebar({ onTableSelect, ...props }: { onTableSelect: (query: string) => void } & ComponentProps<typeof Sidebar>) {
    const [tables, setTables] = useState<Table>({});
    const [loading, setLoading] = useState(true);

    const handleTableSelect = (tableName: string) => {
        const columns = tables[tableName].map((column) => column.name).join(",");
        const query = `SELECT ${columns} FROM ${tableName} LIMIT 10`;
      onTableSelect(query);
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await fetchTables();
            setTables(data);
          } catch (error) {
            console.error('Ошибка при загрузке таблиц:', error);
          } finally {
            setLoading(false);
          }
        };

        fetchData();
      }, []);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <DatabaseIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">SQL Viewer</span>
                  <span className="truncate text-xs">for Laravel</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={tables} loading={loading} onTableSelect={handleTableSelect}  />
      </SidebarContent>
    </Sidebar>
  )
}
