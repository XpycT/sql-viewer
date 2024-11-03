"use client";
import { forwardRef } from "react";
import { ChevronRight, Table as TableIcon, SendHorizontal } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
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

import { cn } from "@/lib/utils";
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

const SidebarMenuActionSecondary = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    showOnHover?: boolean
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-6 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className
      )}
      {...props}
    />
  )
})

export function NavMain({}) {
  const { tables, queryLimit, setQuery, setSelectedTable } = useStore();

  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName)
  };

  const handleTableSend = (tableName: string) => {
    const columns = tables[tableName].map((column) => column.name).join(",");
    const query = `SELECT ${columns} FROM ${tableName} LIMIT ${queryLimit}`;

    const formattedQuery = sqlFormat(query);
    setSelectedTable(tableName);
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
                    <SidebarMenuActionSecondary onClick={() => handleTableSend(item)}>
                      <SendHorizontal/>
                      <span className="sr-only">Insert SQL</span>
                    </SidebarMenuActionSecondary>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="pr-0 mr-0">
                        {tables[item]?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.name} className="h-6">
                            <SidebarMenuSubButton asChild>
                              <div className="flex justify-between text-xs">
                                {subItem.name}{" "}
                                {subItem.type_name && (
                                  <Badge variant="secondary" className="text-xs">
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
