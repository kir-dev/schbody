import { FaMagnifyingGlass } from 'react-icons/fa6';

import { Th2 } from '@/components/typography/typography';
import { Card, CardContent } from '@/components/ui/card';

export default function NotFoundCard() {
  return (
    <Card className='w-full pt-8'>
      <CardContent className='flex flex-col gap-4 w-full items-center'>
        <FaMagnifyingGlass className='animate-caret-blink' size={48} />
        <Th2>Nincs találat</Th2>
      </CardContent>
    </Card>
  );
}
