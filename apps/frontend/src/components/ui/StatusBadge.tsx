import React, { useMemo } from 'react';
import {
  FiArrowDownCircle,
  FiArrowRightCircle,
  FiCheckCircle,
  FiClock,
  FiDisc,
  FiMinusCircle,
  FiPauseCircle,
  FiPrinter,
  FiRotateCcw,
  FiTruck,
} from 'react-icons/fi';

import { Badge } from '@/components/ui/badge';
import { statusConvert } from '@/lib/status';
import { ApplicationStatus } from '@/types/application-entity';

export default function StatusBadge({ status, hover }: Readonly<{ status: ApplicationStatus }> & { hover?: boolean }) {
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
        return <FiDisc />;
      case ApplicationStatus.ACCEPTED:
        return <FiCheckCircle />;
      case ApplicationStatus.REJECTED:
        return <FiMinusCircle />;
      case ApplicationStatus.PREPARED_FOR_PRINT:
        return <FiPrinter />;
      case ApplicationStatus.MANUFACTURED:
        return <FiArrowDownCircle />;
      case ApplicationStatus.DISTRIBUTED:
        return <FiTruck />;
      case ApplicationStatus.WAITING_FOR_OPS:
        return <FiPauseCircle />;
      case ApplicationStatus.VALID:
        return <FiArrowRightCircle />;
      case ApplicationStatus.REVOKED:
        return <FiRotateCcw />;
      case ApplicationStatus.EXPIRED:
        return <FiClock />;
    }
  }, [convertedStatus]);

  return (
    <Badge variant={color} hover={hover === undefined ? true : hover}>
      <div className='py-1 pr-2'>{icon}</div>
      {ApplicationStatus[convertedStatus]}
    </Badge>
  );
}
