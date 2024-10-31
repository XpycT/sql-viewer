import { useState, useEffect } from 'react';
import { DatabaseIcon } from 'lucide-react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Sidebar } from '@/components/Sidebar';
import { QueryEditor } from '@/components/QueryEditor';
import { QueryResults } from '@/components/QueryResults';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/toaster';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return localStorage.getItem('theme') as 'light' | 'dark' || 'light';
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [query, setQuery] = useState('SELECT * FROM users;');

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
                <QueryEditor query={query} onQueryChange={setQuery} />
              </ResizablePanel>

              <ResizableHandle />

              <ResizablePanel defaultSize={50}>
                <QueryResults />
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
