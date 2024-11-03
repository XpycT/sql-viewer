import { create } from "zustand";

import { Table } from "@/types/table";
import { QueryResults } from "@/types/query-results";

interface State {
  query: string;
  setQuery: (query: string) => void;

  queryResult: QueryResults | null;
  setQueryResult: (queryResult: QueryResults) => void;

  error: string | null;
  setError: (error: string) => void;

  tables: Table;
  setTables: (tables: Table) => void;
}

export const useStore = create<State>((set) => ({
  query: "",
  setQuery: (query: string) => set({ query }),

  queryResult: null,
  setQueryResult: (queryResult: QueryResults) => set({ queryResult }),

  error: null,
  setError: (error: string) => set({ error }),

  tables: {},
  setTables: (tables: Table) => set({ tables }),
}));
