import React from "react";

import type { Column } from "@/types/table";

import {
  isDate,
  isNumber,
  isText,
  isBlob,
  isBoolean
} from "@/lib/sql-type-check";

import {
  KeyRoundIcon,
  KeySquareIcon,
  CuboidIcon,
  CalendarIcon,
  TypeIcon,
  HashIcon,
  ToggleLeftIcon,
  HelpCircleIcon
} from "lucide-react";

export const KeyIcon: React.FC<{ column: Column | undefined }> = React.memo(
  ({ column }) => {
    return (
      <>
        {column?.isPrimaryKey && (
          <p className="text-sm font-semibold text-yellow-600">(Primary)</p>
        )}
        {column?.isForeignKey && (
          <p className="text-sm font-semibold text-purple-600">(Foreign)</p>
        )}
      </>
    );
  }
);

export const ColumnIcon: React.FC<{ column: Column }> = React.memo(
  ({ column }) => {
    const { type_name, isPrimaryKey, isForeignKey } = column;

    if (isPrimaryKey)
      return <KeyRoundIcon className="h-4 w-4 text-yellow-500" />;
    if (isForeignKey)
      return <KeySquareIcon className="h-4 w-4 text-purple-500" />;

    if (type_name) {
      if (isBlob(type_name))
        return <CuboidIcon className="h-4 w-4 text-green-500" />;
      if (isDate(type_name))
        return <CalendarIcon className="h-4 w-4 text-blue-500" />;
      if (isText(type_name)) return <TypeIcon className="h-4 w-4 text-indigo-500" />;
      if (isNumber(type_name)) return <HashIcon className="h-4 w-4 text-red-500" />;
      if (isBoolean(type_name))
        return <ToggleLeftIcon className="h-4 w-4 text-pink-500" />;
    }

    return <HelpCircleIcon className="h-4 w-4 text-gray-500" />;
  }
);
