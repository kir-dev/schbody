import { CgSandClock } from 'react-icons/cg';

import { Th2 } from '@/components/typography/typography';
import { Card, CardContent } from '@/components/ui/card';

export default function LoadingCard() {
  return (
    <Card className='w-full pt-8'>
      <CardContent className='flex flex-col gap-4 w-full items-center'>
        <CgSandClock className='animate-slow-spin' size={48} />
        <Th2>Töltés</Th2>
      </CardContent>
    </Card>
  );
}
