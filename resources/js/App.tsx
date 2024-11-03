import { useState, useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { QueryEditor } from "@/components/QueryEditor";
import { QueryResultsTable } from "@/components/QueryResultsTable";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toaster } from "@/components/ui/toaster";
import { AlertCircle } from "lucide-react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useStore } from "@/store/useStore";

function App() {
  const { error } = useStore();

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("theme") as "light" | "dark") || "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
          </div>
          <div className="ml-auto px-3">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel className="p-0" defaultSize={40} minSize={20}>
              <QueryEditor />
            </ResizablePanel>

            <div>
              <ResizableHandle withHandle />
            </div>

            <ResizablePanel defaultSize={60} minSize={20}>
              {error ? (
                <div className="p-4">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </div>
              ) : (
                <QueryResultsTable />
              )}
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
