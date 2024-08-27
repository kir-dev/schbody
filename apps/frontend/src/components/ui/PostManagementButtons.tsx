'use client';
import { FiEdit2, FiTrash } from 'react-icons/fi';

import { Button } from '@/components/ui/button';
import useProfile from '@/hooks/useProfile';
import { Role } from '@/types/user-entity';

type PostManagementButtonsProps = {
  onEdit: () => Promise<void>;
  onDelete: () => Promise<void>;
};
export default function PostManagementButtons(props: PostManagementButtonsProps) {
  const { data: user } = useProfile();

  return (
    <div className='flex w-full justify-end '>
      {user?.role === Role.BODY_ADMIN && (
        <div className='flex gap-4 opacity-30 hover:opacity-100' onClick={props.onEdit}>
          <Button className='flex items-center gap-2' variant='secondary' onClick={props.onEdit}>
            <FiEdit2 />
            Módosítás
          </Button>
          <Button className='flex items-center gap-2' variant='destructive' onClick={props.onDelete}>
            <FiTrash />
            Törlés
          </Button>
        </div>
      )}
    </div>
  );
}
