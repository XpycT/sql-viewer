import { useState } from 'react';
import { DatabaseIcon } from 'lucide-react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Sidebar } from '@/components/Sidebar';
import { QueryEditor } from '@/components/QueryEditor';
import { QueryResults } from '@/components/QueryResults';
import { ThemeToggle } from '@/components/ThemeToggle';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
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
        <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-[60px]' : 'ml-[250px]'}`}>
          <div className="h-[calc(100vh-4rem)] flex flex-col">
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={50}>
                <QueryEditor />
              </ResizablePanel>

              <ResizableHandle />

              <ResizablePanel defaultSize={50}>
                <QueryResults />
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
