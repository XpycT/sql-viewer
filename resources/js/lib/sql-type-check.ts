const TYPE_PATTERNS = {
    DATE: /DATE|TIMESTAMP/i,
    BLOB: /^BLOB$/i,
    TEXT: /CHAR|TEXT|CLOB|VARCHAR/i,
    INTEGER: /INT|BIGINT|TINYINT|SMALLINT/i,
    REAL: /REAL|FLOAT|DOUBLE|DECIMAL/i,
    NUMERIC: /NUMERIC/i,
    BOOLEAN: /BOOL/i
  };

  type SQLiteType = keyof typeof TYPE_PATTERNS;

  const checkType = (value: string, type: SQLiteType): boolean =>
    TYPE_PATTERNS[type].test(value);

  export const isDate = (value: string) => checkType(value, "DATE");
  export const isBlob = (value: string) => checkType(value, "BLOB");
  export const isText = (value: string) => checkType(value, "TEXT");
  export const isInteger = (value: string) => checkType(value, "INTEGER");
  export const isReal = (value: string) => checkType(value, "REAL");
  export const isNumeric = (value: string) => checkType(value, "NUMERIC");
  export const isBoolean = (value: string) => checkType(value, "BOOLEAN");

  export const isNumber = (value: string) =>
    isInteger(value) || isReal(value) || isNumeric(value);
