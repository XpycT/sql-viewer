import { Badge } from '@/components/ui/badge';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger
} from "@/components/ui/hover-card";
import { Column } from '@/types/table';

export function QueryResultsField({value, column}: {value: any, column: Column}) {
console.log('asd', column)
    return (
      <>
      <div>
      <HoverCard>
            <HoverCardTrigger asChild>
              <span className="block max-w-[200px] cursor-pointer hover:underline truncate text-ellipsis">
                {value}
              </span>
            </HoverCardTrigger>
            <HoverCardContent side="bottom" align="start" className="text-balance break-words bg-gray-100 dark:bg-gray-700">
              <div className="flex flex-col justify-center gap-1">
              <span className="max-w-full break-words">{value}</span>
                {
                  <Badge className="w-full text-xs font-semibold block text-center">
                    {column.type_name || "Unknown"}
                  </Badge>
                }
              </div>
            </HoverCardContent>
          </HoverCard>

        </div>
      </>
    );
  }
