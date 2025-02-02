import React, { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { statusConvert } from '@/lib/status';
import { ApplicationStatus } from '@/types/application-entity';
import {
  LuCircleArrowDown,
  LuCircleCheckBig,
  LuCircleDashed,
  LuCircleEllipsis,
  LuCirclePause,
  LuCirclePlay,
  LuCircleUser,
  LuCircleX,
  LuClock4,
  LuRotateCcw,
} from 'react-icons/lu';

export default function StatusBadge({ status }: Readonly<{ status: ApplicationStatus }>) {
  const convertedStatus = statusConvert(status);
  const color = useMemo(() => {
    switch (ApplicationStatus[convertedStatus]) {
      case ApplicationStatus.SUBMITTED:
        return 'blue';
      case ApplicationStatus.ACCEPTED:
        return 'cyan';
      case ApplicationStatus.REJECTED:
        return 'red';
      case ApplicationStatus.PREPARED_FOR_PRINT:
        return 'yellow';
      case ApplicationStatus.MANUFACTURED:
        return 'orange';
      case ApplicationStatus.DISTRIBUTED:
        return 'purple';
      case ApplicationStatus.WAITING_FOR_OPS:
        return 'gray';
      case ApplicationStatus.VALID:
        return 'green';
      case ApplicationStatus.REVOKED:
        return 'red';
      case ApplicationStatus.EXPIRED:
        return 'gray';
    }
  }, [convertedStatus]);
  const icon: React.JSX.Element = useMemo(() => {
    switch (ApplicationStatus[convertedStatus]) {
      case ApplicationStatus.SUBMITTED:
        return <LuCircleDashed />;
      case ApplicationStatus.ACCEPTED:
        return <LuCircleCheckBig />;
      case ApplicationStatus.REJECTED:
        return <LuCircleX />;
      case ApplicationStatus.PREPARED_FOR_PRINT:
        return <LuCircleEllipsis />;
      case ApplicationStatus.MANUFACTURED:
        return <LuCircleArrowDown />;
      case ApplicationStatus.DISTRIBUTED:
        return <LuCircleUser />;
      case ApplicationStatus.WAITING_FOR_OPS:
        return <LuCirclePause />;
      case ApplicationStatus.VALID:
        return <LuCirclePlay />;
      case ApplicationStatus.REVOKED:
        return <LuRotateCcw />;
      case ApplicationStatus.EXPIRED:
        return <LuClock4 />;
    }
  }, [convertedStatus]);

  return (
    <Badge variant={color} hover={false}>
      <div className='py-1 pr-2'>{icon}</div>
      {ApplicationStatus[convertedStatus]}
    </Badge>
  );
}
