'use client';
import { useRouter } from 'next/navigation';
import { FiFastForward } from 'react-icons/fi';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useCurrentApplication from '@/hooks/useCurrentApplication';
import { useCurrentPeriod } from '@/hooks/usePeriod';
import useProfile from '@/hooks/useProfile';

export default function ApplicationBannerCard() {
  const router = useRouter();
  const currentPeriod = useCurrentPeriod();
  const user = useProfile();
  const application = useCurrentApplication();
  if (
    !currentPeriod ||
    application.data !== undefined ||
    !user.data ||
    user.isLoading ||
    application.isLoading ||
    currentPeriod.isLoading
  ) {
    return null;
  }
  return (
    <div className='flex mt-8'>
      <Card className='w-full bg-amber-100'>
        <CardHeader className='md:flex-row max-md:flex-col w-full justify-between gap-2 max-md:items-start md:items-center'>
          <div>
            <CardTitle> Jelentkezés </CardTitle>
            <CardDescription>
              {' '}
              Jelenleg folyamatban van a <span className='font-bold'>{currentPeriod?.data?.name}</span> jelentkezési
              időszak!
            </CardDescription>
          </div>
          <Button className='max-md:w-full' onClick={() => router.push('/application-form')}>
            <FiFastForward />
            Jelentkezés
          </Button>
        </CardHeader>
      </Card>
    </div>
  );
}
