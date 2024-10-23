import { Th2 } from '../typography/typography';
import { Button } from './button';
import { Dialog, DialogContent } from './dialog';

interface AcceptDialogProps {
  open: boolean;
  title: string;
  description: string;
  onAccept: () => void;
  onDecline: () => void;
}

export function AcceptDialog({ open, title, description, onAccept, onDecline }: AcceptDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent className='sm:max-w-[425px]' closable={false}>
        <div className='flex flex-col gap-4 w-full items-center'>
          <Th2>{title}</Th2>
          <p className='text-center'>{description}</p>
          <div className='flex gap-4'>
            <Button onClick={onAccept} variant='default'>
              Igen
            </Button>
            <Button onClick={onDecline} variant='destructive'>
              Mégse
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
