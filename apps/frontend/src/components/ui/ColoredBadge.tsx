import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { statusConvert } from '@/lib/utils';
import { ApplicationStatus } from '@/types/application-entity';

export default function ColoredBadge({ status }: { status: ApplicationStatus }) {
  const convertedStatus = statusConvert(status);
  const color = useMemo(() => {
    switch (ApplicationStatus[convertedStatus]) {
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
      {ApplicationStatus[convertedStatus]}
    </Badge>
  );
}
