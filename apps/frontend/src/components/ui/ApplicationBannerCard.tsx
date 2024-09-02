'use client';
import { useRouter } from 'next/navigation';
import { FiFastForward } from 'react-icons/fi';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ColoredBadge from '@/components/ui/ColoredBadge';
import useCurrentApplication from '@/hooks/useCurrentApplication';
import { useCurrentPeriod } from '@/hooks/usePeriod';

export default function ApplicationBannerCard() {
  const router = useRouter();
  const { data: currentPeriod } = useCurrentPeriod();
  const application = useCurrentApplication();
  if (!currentPeriod) {
    return null;
  }
  if (application.data) {
    return (
      <Card className='w-full bg-amber-200'>
        <CardHeader className='md:flex-row max-md:flex-col w-full justify-between gap-2 max-md:items-start md:items-center'>
          <div>
            <CardTitle> Leadott jelentkezés </CardTitle>
            <CardDescription>
              A most zajló, <span className='font-bold'>{currentPeriod!.name}</span> időszakra már sikeresen
              jelentkeztél!
            </CardDescription>
          </div>
          <div className='flex md:flex-row max-md:flex-col gap-4'>
            <p>Jelentkezésed státusza: </p>
            <ColoredBadge status={application.data.status} />
          </div>
        </CardHeader>
      </Card>
    );
  }
  return (
    <Card className='w-full bg-amber-200'>
      <CardHeader className='md:flex-row max-md:flex-col w-full justify-between gap-2 max-md:items-start md:items-center'>
        <div>
          <CardTitle> Jelentkezés </CardTitle>
          <CardDescription>
            {' '}
            Jelenleg folyamatban van a <span className='font-bold'>{currentPeriod!.name}</span> jelentkezési időszak!
          </CardDescription>
        </div>
        <Button className='max-md:w-full' onClick={() => router.push('/application-form')}>
          <FiFastForward />
          Jelentkezés
        </Button>
      </CardHeader>
    </Card>
  );
}
