import { useCallback, useEffect, useState, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import { Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function QueryEditor() {
  const { toast } = useToast()
  const [query, setQuery] = useState('SELECT * FROM users;');
  const codeEditorRef = useRef<any>(null)

  const handleChange = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.altKey && event.key === 'Enter') {
      event.preventDefault()
      const editor = codeEditorRef.current?.view
      if (editor) {
        const selection = editor.state.selection.ranges[0]
        const selectedText = editor.state.sliceDoc(selection.from, selection.to)
        console.log(`Выполняется запрос: ${selectedText || query}`, selection, selectedText)
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
