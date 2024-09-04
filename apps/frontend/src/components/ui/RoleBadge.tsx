import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Role } from '@/types/user-entity';

export default function RoleBadge({ role }: { role: Role }) {
  const convertedRole = role as unknown as Role;
  const color = useMemo(() => {
    switch (Role[convertedRole]) {
      case Role.USER:
        return 'blue';
      case Role.BODY_MEMBER:
        return 'yellow';
      case Role.BODY_ADMIN:
        return 'red';
      case Role.SUPERUSER:
        return 'green';
    }
  }, [role]);

  return <Badge variant={color}>{Role[convertedRole]}</Badge>;
}
