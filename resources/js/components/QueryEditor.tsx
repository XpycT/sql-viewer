import { useCallback, useEffect, useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import { Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface QueryEditorProps {
  query: string;
  onQueryChange: (query: string) => void;
  onQueryResult: (result: any) => void;
  onError: (error: string) => void;
}

export function QueryEditor({ query, onQueryChange, onQueryResult, onError }: QueryEditorProps) {
  const { toast } = useToast();
  const codeEditorRef = useRef<any>(null)

  const handleChange = useCallback((value: string) => {
    onQueryChange(value);
  }, [onQueryChange]);

  const executeQuery = async (sql: string) => {
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      const response = await fetch('/sql-viewer/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
        },
        body: JSON.stringify({ query: sql }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Query execution error');
      }

      onQueryResult(data);
      toast({
        title: 'Executed',
        description: 'Query executed successfully',
      })
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.altKey && event.key === 'Enter') {
      event.preventDefault()
      const editor = codeEditorRef.current?.view
      if (editor) {
        const selection = editor.state.selection.ranges[0]
        const selectedText = editor.state.sliceDoc(selection.from, selection.to)
        executeQuery(selectedText || query)
      }
    }
  }, [query])

  const downloadQuery = () => {
    const element = document.createElement('a');
    const file = new Blob([query], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'query.sql';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast({
      title: 'Downloaded',
      description: 'Query downloaded to downloads folder',
    })
  };

  async function copyTextToClipboard(text: string) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  const copyQuery = async () => {
    try {
      await copyTextToClipboard(query);
      toast({
        title: 'Copied',
        description: 'Query copied to clipboard',
      })
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-full flex flex-col p-4 bg-background">
      <div className="flex justify-end space-x-2 mb-2">
        <Button variant="outline" size="sm" onClick={downloadQuery}>
          <Download className="h-4 w-4 mr-2" />
          Download SQL
        </Button>
        <Button variant="outline" size="sm" onClick={copyQuery}>
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
      </div>
      <div className="flex-1 border rounded-md overflow-hidden">
        <CodeMirror
          value={query}
          height="100%"
          style={{ height: '100%' }}
          extensions={[sql()]}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          ref={codeEditorRef}
          theme={isDark ? githubDark : githubLight}
          basicSetup={{
            lineNumbers: true,
            allowMultipleSelections: false
          }}
        />
      </div>
    </div>
  );
}
