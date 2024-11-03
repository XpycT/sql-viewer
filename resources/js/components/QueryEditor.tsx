import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import {
  autocompletion,
  type CompletionContext,
} from "@codemirror/autocomplete";
import { sql, MySQL, SQLite, PostgreSQL, MariaSQL } from "@codemirror/lang-sql";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { Download, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { fetchQuery } from "@/api";

import { useStore } from "@/store/useStore";

import {
  SQLITE_KEYWORDS,
  MYSQL_KEYWORDS,
  POSTGRESQL_KEYWORDS,
  MARIADB_KEYWORDS,
  POSTGRES_KEYWORDS,
} from "@/lib/sql-keywords";

export function QueryEditor({}) {
  const { query, tables, setQuery, setQueryResult, setError } = useStore();
  const { toast } = useToast();
  const codeEditorRef = useRef<any>(null);

  const handleChange = useCallback(
    (value: string) => {
      setQuery(value);
    },
    [setQuery]
  );

  const executeQuery = async (sql: string) => {
    try {
      setError(null);
      const data = await fetchQuery(sql);
      setQueryResult(data);
      toast({
        title: "Executed",
        description: "Query executed successfully",
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    }
  };

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.altKey && event.key === "Enter") {
        event.preventDefault();
        const editor = codeEditorRef.current?.view;
        if (editor) {
          const selection = editor.state.selection.ranges[0];
          const selectedText = editor.state.sliceDoc(
            selection.from,
            selection.to
          );
          executeQuery(selectedText || query);
        }
      }
    },
    [query]
  );

  const downloadQuery = () => {
    const element = document.createElement("a");
    const file = new Blob([query], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "query.sql";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast({
      title: "Downloaded",
      description: "Query downloaded to downloads folder",
    });
  };

  async function copyTextToClipboard(text: string) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  const copyQuery = async () => {
    try {
      await copyTextToClipboard(query);
      toast({
        title: "Copied",
        description: "Query copied to clipboard",
      });
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  const myCompletions = useCallback(
    (context: CompletionContext) => {
      const word = context.matchBefore(/\w*/);
      if (!word || (word.from === word.to && !context.explicit)) return null;

      let KEYWORDS = [];
      switch (window.sqlViewerConfig.schema) {
        case "mysql":
          KEYWORDS = MYSQL_KEYWORDS;
          break;
        case "postgres":
        case "pgsql":
          KEYWORDS = POSTGRES_KEYWORDS;
          break;
        case "mariadb":
          KEYWORDS = MARIADB_KEYWORDS;
          break;
        case "sqlite":
        case "sqlite3":
          KEYWORDS = SQLITE_KEYWORDS;
          break;
        default:
          KEYWORDS = MYSQL_KEYWORDS;
      }

      const options = [
        ...KEYWORDS.map((keyword) => ({
          label: keyword,
          type: "keyword",
        })),
        ...Object.keys(tables).map((table) => ({
          label: table,
          type: "table",
        })),
        // ...columnNames.map((column) => ({ label: column, type: "column" }))
      ];

      return {
        from: word.from,
        to: word.to,
        options: options,
      };
    },
    [tables]
  );

  const extensions = useMemo(
    () => [SQLite, sql(), autocompletion({ override: [myCompletions] })],
    [myCompletions]
  );

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDark(document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-full flex flex-col py-4 bg-background">
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
      <div className="flex-1 border rounded-md">
        <CodeMirror
          value={query}
          placeholder={"Use ALT+ENTER to execute query"}
          height="100%"
          style={{ height: "100%" }}
          extensions={extensions}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          ref={codeEditorRef}
          theme={isDark ? githubDark : githubLight}
          basicSetup={{
            lineNumbers: true,
            allowMultipleSelections: false,
            autocompletion: true,
          }}
        />
      </div>
    </div>
  );
}
