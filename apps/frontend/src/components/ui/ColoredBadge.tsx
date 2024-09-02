import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { ApplicationStatus } from '@/types/application-entity';

export default function ColoredBadge({ status }: { status: keyof typeof ApplicationStatus }) {
  const color = useMemo(() => {
    switch (ApplicationStatus[status]) {
      case ApplicationStatus.SUBMITTED:
        return 'blue';
      case ApplicationStatus.ACCEPTED:
        return 'green';
      case ApplicationStatus.REJECTED:
        return 'red';
      case ApplicationStatus.NEEDS_REVIEW:
        return 'yellow';
      case ApplicationStatus.FINISHED:
        return 'purple';
    }
  }, [status]);

  return (
    <Badge variant={color} className='w-44 text-center'>
      {ApplicationStatus[status]}
    </Badge>
  );
}
