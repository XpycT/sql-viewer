"use client";

import { ChevronRight, Table as TableIcon } from "lucide-react";

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
import { Table } from '@/types/table';

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
  items: Table;
  loading: boolean;
  onTableSelect: (tableName: string) => void;
}) {
    // return null;
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Tables ({Object.keys(items).length || 0})</SidebarGroupLabel>
      <SidebarMenu>
        {loading && <NavMainSkeleton />}
        {!loading && Object.keys(items).map((item) => (
            <Collapsible key={item} asChild>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={item}>
                  <a href="#" onClick={() => onTableSelect(item)}>
                    <TableIcon />
                    <span>{item}</span>
                  </a>
                </SidebarMenuButton>
                {items[item]?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="pr-0 mr-0">
                        {items[item]?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.name}>
                            <SidebarMenuSubButton asChild>
                              <div className="flex justify-between">
                                {subItem.name}{" "}
                                {subItem.type_name && <Badge variant="secondary">
                                  {subItem.type_name}
                                </Badge>}
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
