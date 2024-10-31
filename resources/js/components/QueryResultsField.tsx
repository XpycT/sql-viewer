import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function QueryResultsField({value, isHidden}: {value: string, isHidden: boolean}) {

    const [ hidden, setHidden ] = useState(isHidden);

    return (
      <>
      {hidden ? '••••••' : value}
      {isHidden && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => {
            setHidden(!hidden);
          }}
        >
          {hidden ?
            <EyeOff className="h-4 w-4" /> :
            <Eye className="h-4 w-4" />
          }
        </Button>
      )}
      </>
    );
  }
