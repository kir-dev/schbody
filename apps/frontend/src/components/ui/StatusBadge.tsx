import { useMemo } from 'react';
import {
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
import { statusConvert } from '@/lib/utils';
import { ApplicationStatus } from '@/types/application-entity';

export default function StatusBadge({ status }: Readonly<{ status: ApplicationStatus }>) {
  const convertedStatus = statusConvert(status);
  const color = useMemo(() => {
    switch (ApplicationStatus[convertedStatus]) {
      case ApplicationStatus.SUBMITTED:
        return 'blue';
      case ApplicationStatus.ACCEPTED:
        return 'green';
      case ApplicationStatus.REJECTED:
        return 'red';
      case ApplicationStatus.PREPARED_FOR_PRINT:
        return 'yellow';
      case ApplicationStatus.PRINTED:
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
  }, [status]);
  const icon: JSX.Element = useMemo(() => {
    switch (ApplicationStatus[convertedStatus]) {
      case ApplicationStatus.SUBMITTED:
        return <FiDisc />;
      case ApplicationStatus.ACCEPTED:
        return <FiCheckCircle />;
      case ApplicationStatus.REJECTED:
        return <FiMinusCircle />;
      case ApplicationStatus.PREPARED_FOR_PRINT:
        return <FiPrinter />;
      case ApplicationStatus.PRINTED:
        return <FiPrinter />;
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
  }, [status]);

  return (
    <Badge variant={color}>
      {icon}
      {ApplicationStatus[convertedStatus]}
    </Badge>
  );
}
