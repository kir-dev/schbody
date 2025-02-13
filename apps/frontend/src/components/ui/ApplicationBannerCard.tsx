'use client';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useCurrentApplication from '@/hooks/useCurrentApplication';
import useLastApplication from '@/hooks/useLastApplication';
import { useCurrentPeriod } from '@/hooks/usePeriod';
import useProfile from '@/hooks/useProfile';

import SubmittedApplicationBannerCard from './SubmittedApplicationBannerCard';
import { LuFastForward } from 'react-icons/lu';

export default function ApplicationBannerCard() {
  const router = useRouter();
  const currentPeriod = useCurrentPeriod();
  const user = useProfile();
  const currentApplication = useCurrentApplication();
  const lastApplication = useLastApplication();
  if (!user.data || user.isLoading || currentApplication.isLoading || currentPeriod.isLoading) {
    return null;
  }
  if (currentApplication.data && currentPeriod.data) {
    return (
      <SubmittedApplicationBannerCard
        user={user.data}
        application={currentApplication.data}
        currentPeriod={currentPeriod.data}
      />
    );
  } else if (currentPeriod.data) {
    return (
      <Card className='w-full'>
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
            <LuFastForward />
            Jelentkezés
          </Button>
        </CardHeader>
      </Card>
    );
  } else if (lastApplication.data) {
    return <SubmittedApplicationBannerCard user={user.data} application={lastApplication.data} />;
  }
  return null;
}
