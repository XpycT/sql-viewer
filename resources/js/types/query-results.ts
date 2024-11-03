import { Column } from "./table";

export type QueryResultsType = 'SELECT' | 'UPDATE' | 'INSERT' | 'DELETE' | 'ERROR';


export interface QueryResults {
    type: QueryResultsType;
    columns?: string[];
    rows?: any[];
    structure?: Column[];
    error?: string;
}
