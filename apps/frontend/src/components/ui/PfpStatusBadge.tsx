import React, { JSX, useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { ProfilePictureStatus } from '@/types/user-entity';
import { LuUserCheck, LuUserMinus, LuUserSearch } from 'react-icons/lu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { pfpStatusConvert } from '@/lib/status';

const badgeColors: Record<any, 'green' | 'yellow' | 'red'> = {
  [ProfilePictureStatus.ACCEPTED]: 'green',
  [ProfilePictureStatus.PENDING]: 'yellow',
  [ProfilePictureStatus.REJECTED]: 'red',
};

const badgeIcons: Record<ProfilePictureStatus, JSX.Element> = {
  [ProfilePictureStatus.ACCEPTED]: <LuUserCheck />,
  [ProfilePictureStatus.PENDING]: <LuUserSearch />,
  [ProfilePictureStatus.REJECTED]: <LuUserMinus />,
};

export default function PfpStatusBadge({ status }: { status: ProfilePictureStatus }) {
  const convertedStatus = pfpStatusConvert(status);
  const color = useMemo(() => badgeColors[ProfilePictureStatus[convertedStatus]] ?? 'gray', [status]);
  const icon = useMemo(() => badgeIcons[ProfilePictureStatus[convertedStatus]] ?? <LuUserSearch />, [status]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={color} hover={false}>
            <div className='px-0.5 py-1'>{icon}</div>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className='font-sans'>{ProfilePictureStatus[convertedStatus]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
