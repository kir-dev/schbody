import { Button } from './button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog';

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
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className='my-8'>{description}</DialogDescription>
        </DialogHeader>
        <div className='flex gap-4'>
          <Button onClick={onAccept} variant='default'>
            Igen
          </Button>
          <Button onClick={onDecline} variant='destructive'>
            Mégse
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
