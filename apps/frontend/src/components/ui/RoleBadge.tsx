import { useMemo } from 'react';
import { FiKey, FiMeh, FiSmile, FiUser } from 'react-icons/fi';

import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Role } from '@/types/user-entity';

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

export default function RoleBadge({ role, short }: { role: Role; short?: boolean }) {
  const convertedRole = role as unknown as Role;
  const color = useMemo(() => getRoleBadgeColor(role), [role]);
  // eslint-disable-next-line no-undef
  const icon: JSX.Element = useMemo(() => {
    switch (Role[convertedRole]) {
      case Role.USER:
        return <FiUser />;
      case Role.BODY_MEMBER:
        return <FiMeh />;
      case Role.BODY_ADMIN:
        return <FiSmile />;
      case Role.SUPERUSER:
        return <FiKey />;
    }
  }, [role]);

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
    <Badge variant={color}>
      <div className='py-1'>{icon}</div>
      {!short && Role[convertedRole]}
    </Badge>
  );
}
