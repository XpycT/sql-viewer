import { useCallback, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import { Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function QueryEditor() {
  const handleChange = useCallback((value: string) => {
    // Handle query changes
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.altKey && event.key === 'Enter') {
      const selection = window.getSelection()?.toString();
      if (selection) {
        console.log('Selected text:', selection);
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const downloadQuery = () => {
    const element = document.createElement('a');
    const file = new Blob(['SELECT * FROM users;'], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'query.sql';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyQuery = async () => {
    try {
      await navigator.clipboard.writeText('SELECT * FROM users;');
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

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
          value="SELECT * FROM users;"
          height="100%"
          style={{ height: '100%' }}
          extensions={[sql()]}
          onChange={handleChange}
          theme={document.documentElement.classList.contains('dark') ? githubDark : githubLight}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            history: true,
            foldGutter: true,
            drawSelection: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            syntaxHighlighting: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            defaultKeymap: true,
            searchKeymap: true,
            historyKeymap: true,
            foldKeymap: true,
            completionKeymap: true,
            lintKeymap: true,
          }}
        />
      </div>
    </div>
  );
}