'use client';
import { Button } from '@/components/ui/button';
import useProfile from '@/hooks/useProfile';
import { Role } from '@/types/user-entity';
import { LuPencil, LuTrash2 } from 'react-icons/lu';

type PostManagementButtonsProps = {
  onEdit: () => void;
  onDelete: () => void;
};
export default function PostManagementButtons(props: PostManagementButtonsProps) {
  const { data: user } = useProfile();

  return (
    <div>
      {(user?.role === Role.BODY_ADMIN || user?.role === Role.SUPERUSER) && (
        <div className='flex gap-2'>
          <Button className='text-xs h-min' variant='secondary' onClick={props.onEdit}>
            <LuPencil />
            Módosítás
          </Button>
          <Button className='text-xs h-min' variant='destructive' onClick={props.onDelete}>
            <LuTrash2 />
            Törlés
          </Button>
        </div>
      )}
    </div>
  );
}
