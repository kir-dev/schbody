import { useMemo } from 'react';
import { FiAlertCircle, FiArrowRightCircle, FiCheckCircle, FiDisc, FiMinusCircle, FiPrinter } from 'react-icons/fi';

import { Badge } from '@/components/ui/badge';
import { statusConvert } from '@/lib/utils';
import { ApplicationStatus } from '@/types/application-entity';

export default function StatusBadge({ status }: { status: ApplicationStatus }) {
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
      case ApplicationStatus.PRINTED:
        return 'orange';
      case ApplicationStatus.FINISHED:
        return 'purple';
    }
  }, [status]);
  // eslint-disable-next-line no-undef
  const icon: JSX.Element = useMemo(() => {
    switch (ApplicationStatus[convertedStatus]) {
      case ApplicationStatus.SUBMITTED:
        return <FiDisc />;
      case ApplicationStatus.ACCEPTED:
        return <FiCheckCircle />;
      case ApplicationStatus.REJECTED:
        return <FiMinusCircle />;
      case ApplicationStatus.NEEDS_REVIEW:
        return <FiAlertCircle />;
      case ApplicationStatus.PRINTED:
        return <FiPrinter />;
      case ApplicationStatus.FINISHED:
        return <FiArrowRightCircle />;
    }
  }, [status]);

  return (
    <Badge variant={color}>
      {icon}
      {ApplicationStatus[convertedStatus]}
    </Badge>
  );
}
