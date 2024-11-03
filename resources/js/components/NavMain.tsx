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

import { format } from "sql-formatter";
import { useStore } from "@/store/useStore";

function sqlFormat(code: string) {
  try {
    return format(code, {
      useTabs: false,
      keywordCase: "upper",
      tabWidth: 2,
      expressionWidth: 100,
      linesBetweenQueries: 1,
    });
  } catch {
    return code;
  }
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
  );
}

export function NavMain({}) {
  const { tables, setQuery } = useStore();

  const handleTableSelect = (tableName: string) => {
    const columns = tables[tableName].map((column) => column.name).join(",");
    const query = `SELECT ${columns} FROM ${tableName} LIMIT 10`;

    const formattedQuery = sqlFormat(query);
    setQuery(formattedQuery);
  };
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        Tables ({Object.keys(tables).length || 0})
      </SidebarGroupLabel>
      <SidebarMenu>
        {!tables && <NavMainSkeleton />}
        {tables &&
          Object.keys(tables).map((item) => (
            <Collapsible key={item} asChild>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={item}>
                  <a href="#" onClick={() => handleTableSelect(item)}>
                    <TableIcon />
                    <span>{item}</span>
                  </a>
                </SidebarMenuButton>
                {tables[item]?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="pr-0 mr-0">
                        {tables[item]?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.name}>
                            <SidebarMenuSubButton asChild>
                              <div className="flex justify-between">
                                {subItem.name}{" "}
                                {subItem.type_name && (
                                  <Badge variant="secondary">
                                    {subItem.type_name}
                                  </Badge>
                                )}
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
