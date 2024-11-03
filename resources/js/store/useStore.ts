import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Table } from "@/types/table";
import { QueryResults } from "@/types/query-results";

type Theme = "light" | "dark";

interface State {

  theme: Theme;
  setTheme: (theme: Theme) => void;

  query: string;
  setQuery: (query: string) => void;

  queryResult: QueryResults | null;
  setQueryResult: (queryResult: QueryResults) => void;

  error: string | null;
  setError: (error: string | null) => void;

  tables: Table;
  setTables: (tables: Table) => void;
}

export const useStore = create<State>()(
  persist(
    (set) => ({

      theme: "light",
      setTheme: (theme: Theme) => set({ theme }),

      query: "",
      setQuery: (query: string) => set({ query }),

      queryResult: null,
      setQueryResult: (queryResult: QueryResults) => set({ queryResult }),

      error: null,
      setError: (error: string | null) => set({ error }),

      tables: {},
      setTables: (tables: Table) => set({ tables }),
    }),
    {
      name: "sql-viewer",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        query: state.query
      }),
    }
  )
);
