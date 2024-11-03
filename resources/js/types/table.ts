export interface Column {
    name: string;
    type: object;
    type_name: string;
    length: number | null;
    nullable: boolean;
    default: any;
    isPrimaryKey: boolean;
    isForeignKey: boolean;
}

export interface Table {
    [name: string]: Column[];
}
