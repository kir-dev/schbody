'use client';
import { FiEdit2, FiTrash } from 'react-icons/fi';

import { Button } from '@/components/ui/button';
import useProfile from '@/hooks/useProfile';
import { Role } from '@/types/user-entity';

type PostManagementButtonsProps = {
  onEdit: () => void;
  onDelete: () => void;
};
export default function PostManagementButtons(props: PostManagementButtonsProps) {
  const { data: user } = useProfile();

  return (
    <div className='flex w-full justify-end overflow-hidden '>
      {user?.role === Role.BODY_ADMIN && (
        <div className='flex gap-4'>
          <Button variant='secondary' onClick={props.onEdit}>
            <FiEdit2 />
            Módosítás
          </Button>
          <Button variant='destructive' onClick={props.onDelete}>
            <FiTrash />
            Törlés
          </Button>
        </div>
      )}
    </div>
  );
}
