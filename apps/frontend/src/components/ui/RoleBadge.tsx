import React, { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Role } from '@/types/user-entity';
import { LuCirclePower, LuCircleUserRound, LuCrown, LuKeyRound } from 'react-icons/lu';

export function getRoleBadgeColor(role: Role, bg?: boolean) {
  const convertedRole = role as unknown as Role;
  switch (Role[convertedRole]) {
    case Role.USER:
      return bg ? 'bg-blue-400' : 'blue';
    case Role.BODY_MEMBER:
      return bg ? 'bg-yellow-400' : 'yellow';
    case Role.BODY_ADMIN:
      return bg ? 'bg-red-400' : 'red';
    case Role.SUPERUSER:
      return bg ? 'bg-green-400' : 'green';
    default:
      return bg ? 'bg-gray-400' : 'gray';
  }
}

export function getRoleBadgeColorVariant(role: Role) {
  const convertedRole = role as unknown as Role;
  switch (Role[convertedRole]) {
    case Role.USER:
      return 'blue';
    case Role.BODY_MEMBER:
      return 'yellow';
    case Role.BODY_ADMIN:
      return 'red';
    case Role.SUPERUSER:
      return 'green';
    default:
      return 'gray';
  }
}

interface RoleBageProps {
  role: Role;
  short?: boolean;
  hover?: boolean;
}

export default function RoleBadge({ role, short, hover = true }: RoleBageProps) {
  const convertedRole = role as unknown as Role;
  const color = useMemo(() => getRoleBadgeColorVariant(role), [role]);

  const icon: React.JSX.Element = useMemo(() => {
    switch (Role[convertedRole]) {
      case Role.USER:
        return <LuCircleUserRound />;
      case Role.BODY_MEMBER:
        return <LuKeyRound />;
      case Role.BODY_ADMIN:
        return <LuCrown />;
      case Role.SUPERUSER:
        return <LuCirclePower />;
    }
  }, [convertedRole]);

  if (short) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant={color} className='pointer-events-none'>
              <div className='py-1'>{icon}</div>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className='font-sans'>{Role[convertedRole]}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return (
    <Badge variant={color} hover={hover}>
      <div className='py-1 pr-2'>{icon}</div>
      {!short && Role[convertedRole]}
    </Badge>
  );
}
