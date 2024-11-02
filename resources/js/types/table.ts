export interface Column {
    name: string;
    type: object;
    type_name: string;
    length: number | null;
    nullable: boolean;
    default: any;
}

export interface Table {
    [name: string]: Column[];
}
