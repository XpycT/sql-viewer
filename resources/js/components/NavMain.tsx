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
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

interface Column {
  name: string;
  type: string;
}

interface Table {
  name: string;
  columns: Column[];
}

export function NavMain({ items }: { items: Table[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Tables ({items.length || 0})</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.name} asChild>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.name}>
                <a href="#">
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
                    <SidebarMenuSub>
                      {item.columns?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.name}>
                          <SidebarMenuSubButton asChild>
                            <div className="flex justify-between">
                              {subItem.name}{" "}
                              <Badge variant="secondary">{subItem.type}</Badge>
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
