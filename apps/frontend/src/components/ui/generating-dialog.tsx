import { CgSandClock } from 'react-icons/cg';

import { Th2 } from '../typography/typography';
import { Dialog, DialogContent } from './dialog';

export function GeneratingDialog({ open }: { open: boolean }) {
  return (
    <Dialog open={open}>
      <DialogContent className='sm:max-w-[425px]'>
        <div className='flex flex-col gap-4 w-full items-center'>
          <CgSandClock className='animate-slow-spin' size={48} />
          <Th2>Generálás...</Th2>
        </div>
      </DialogContent>
    </Dialog>
  );
}
