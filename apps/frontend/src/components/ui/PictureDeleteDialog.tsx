'use client';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { PropsWithChildren, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/lib/use-toast';

import api from '../network/apiSetup';

type Props = {
  onChange: () => void;
  endpoint: string;
  modalTitle: string;
} & PropsWithChildren;

export default function PictureDeleteDialog({ children, onChange, endpoint, modalTitle }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await api.delete(endpoint);
      toast({ title: 'Profilkép sikeresen törölve!' });
      onChange();
      setIsOpen(false);
    } catch {
      toast({ title: 'Profilkép törlése sikertelen!' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className='max-w-screen sm:max-w-[425px]'>
        <DialogHeader className='h-fit'>
          <div className='h-full flex-col justify-between items-center gap-4 mb-2'>
            <DialogTitle>{modalTitle}</DialogTitle>
            <DialogDescription>Biztos törlöd a profilképed?</DialogDescription>
          </div>
          <div className='flex justify-end gap-2'>
            <Button onClick={() => setIsOpen(false)} variant='outline'>
              Mégse
            </Button>
            <Button onClick={handleDelete} variant='destructive'>
              Törlés
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
