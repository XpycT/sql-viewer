import { useState, useEffect } from 'react';
import { DatabaseIcon } from 'lucide-react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Sidebar } from '@/components/Sidebar';
import { QueryEditor } from '@/components/QueryEditor';
import { QueryResults } from '@/components/QueryResults';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/toaster';
import { AlertCircle } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return localStorage.getItem('theme') as 'light' | 'dark' || 'light';
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [query, setQuery] = useState('SELECT * FROM users;');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const handleQueryResult = (result: any) => {
    setQueryResult(result);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setQueryResult(null);
  };

  return (
    <div className={`min-h-screen ${theme}`}>
      <header className="flex items-center justify-between px-6 py-4 border-b bg-background">
        <div className="flex items-center space-x-2">
          <DatabaseIcon className="h-6 w-6" />
          <h1 className="text-xl font-bold">SQL Explorer</h1>
        </div>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      <div className="flex">
        <Sidebar onCollapsedChange={setIsSidebarCollapsed} />
        <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-[80px]' : 'ml-[250px]'}`}>
          <div className="h-[calc(100vh-4rem)] flex flex-col">
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={50}>
                <QueryEditor
                  query={query}
                  onQueryChange={setQuery}
                  onQueryResult={handleQueryResult}
                  onError={handleError}
                />
              </ResizablePanel>

              <ResizableHandle />

              <ResizablePanel defaultSize={50}>
                {error ? (
                    <div className="p-4">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                            {error}
                            </AlertDescription>
                        </Alert>
                    </div>
                ) : (
                  <QueryResults results={queryResult} />
                )}
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
