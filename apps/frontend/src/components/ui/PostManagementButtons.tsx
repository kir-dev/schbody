'use client';
import { FiEdit2, FiTrash } from 'react-icons/fi';

import { Button } from '@/components/ui/button';
import useProfile from '@/hooks/useProfile';
import { Role } from '@/types/user-entity';

export default function PostManagementButtons() {
  const { data: user } = useProfile();

  return (
    <div className='absolute top-4 right-4'>
      {user?.role === Role.BODY_ADMIN && (
        <div className='flex gap-4 mb-2'>
          <Button className='flex items-center gap-2' variant='secondary'>
            <FiEdit2 />
            Módosítás
          </Button>
          <Button className='flex items-center gap-2' variant='destructive'>
            <FiTrash />
            Törlés
          </Button>
        </div>
      )}
    </div>
  );
}
