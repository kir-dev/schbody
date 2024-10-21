'use client';

import { developers } from '@/components/data/developers';
import Th1 from '@/components/typography/typography';
import { DeveloperItem } from '@/components/ui/DeveloperItem';

export default function Page() {
  return (
    <>
      <Th1>Impressum</Th1>
      <p>Ez az shcbody oldala és mi csináltuk és nagyoj jó lett!!!</p>
      <p>TODO</p>
      <Th1>Fejlesztők</Th1>
      <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4'>
        {developers.map((dev) => (
          <DeveloperItem key={dev.name} dev={dev} />
        ))}
      </div>
    </>
  );
}
