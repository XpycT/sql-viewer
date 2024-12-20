import { useEffect, ComponentProps } from "react";
import { DatabaseIcon } from "lucide-react";

import { NavMain } from "@/components/NavMain";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { fetchTables } from "@/api";
import { useStore } from "@/store/useStore";

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { setTables } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTables();
        setTables(data);
      } catch (error) {
        console.error("Ошибка при загрузке таблиц:", error);
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
        <NavMain />
      </SidebarContent>
    </Sidebar>
  );
}
