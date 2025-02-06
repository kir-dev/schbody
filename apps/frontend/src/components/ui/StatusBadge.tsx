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
import { motion } from 'framer-motion';

export function colorfx(convertedStatus: ApplicationStatus) {
  // @ts-ignore
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
    default:
      return 'gray';
  }
}
export function iconfx(convertedStatus: ApplicationStatus) {
  // @ts-ignore
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
    default:
      return <LuClock4 />;
  }
}

export default function StatusBadge({ status, short }: Readonly<{ status: ApplicationStatus; short?: boolean }>) {
  const convertedStatus = statusConvert(status);
  const [hovered, setHovered] = React.useState(false);
  const handleMouseEnter = () => {
    setHovered(true);
  };
  const handleMouseLeave = () => {
    setHovered(false);
  };

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

  const shrinkVariants = {
    hidden: () => ({
      width: 0,
      opacity: 0,
      transition: { duration: 0.4, ease: 'easeInOut' },
    }),
    visible: () => ({
      width: 'auto',
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeInOut' },
    }),
  };

  if (short) {
    return (
      <Badge
        variant={color}
        hover={false}
        className='w-fit flex items-center overflow-hidden'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className='py-1 -mx-1'>{icon}</div>
        <motion.div
          className='whitespace-nowrap'
          initial='hidden'
          animate={hovered ? 'visible' : 'hidden'}
          variants={shrinkVariants}
        >
          <p className='ml-3'>{ApplicationStatus[convertedStatus]}</p>
        </motion.div>
      </Badge>
    );
  }

  return (
    <Badge variant={color} hover={false}>
      <div className='py-1 pr-2 -ml-0.5'>{icon}</div>
      {ApplicationStatus[convertedStatus]}
    </Badge>
  );
}
