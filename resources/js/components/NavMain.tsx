"use client";

import { ChevronRight, Table } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

interface Column {
  name: string;
  type: string;
  type_name?: string;
}

interface Table {
  name: string;
  columns: Column[];
}

function NavMainSkeleton() {
    return (
      <>
        {Array.from({ length: 5 }).map((_, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuSkeleton showIcon />
          </SidebarMenuItem>
        ))}
      </>
    )
  }

export function NavMain({
  items,
  loading,
  onTableSelect,
}: {
  items: Table[];
  loading: boolean;
  onTableSelect: (tableName: string) => void;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Tables ({items.length || 0})</SidebarGroupLabel>
      <SidebarMenu>
        {loading && <NavMainSkeleton />}
        {!loading && items.map((item) => (
            <Collapsible key={item.name} asChild>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={item.name}>
                  <a href="#" onClick={() => onTableSelect(item.name)}>
                    <Table />
                    <span>{item.name}</span>
                  </a>
                </SidebarMenuButton>
                {item.columns?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="pr-0 mr-0">
                        {item.columns?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.name}>
                            <SidebarMenuSubButton asChild>
                              <div className="flex justify-between">
                                {subItem.name}{" "}
                                <Badge variant="secondary">
                                  {subItem.type_name || subItem.type}
                                </Badge>
                              </div>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
