'use client';
import { useRouter } from 'next/navigation';
import { FiFastForward } from 'react-icons/fi';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/ui/StatusBadge';
import Ticket from '@/components/ui/Ticket';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import useCurrentApplication from '@/hooks/useCurrentApplication';
import useLastApplication from '@/hooks/useLastApplication';
import { useCurrentPeriod } from '@/hooks/usePeriod';
import useProfile from '@/hooks/useProfile';

export default function ApplicationBannerCard() {
  const router = useRouter();
  const currentPeriod = useCurrentPeriod();
  const user = useProfile();
  const currentApplication = useCurrentApplication();
  const lastApplication = useLastApplication();
  if (!user.data || user.isLoading || currentApplication.isLoading || currentPeriod.isLoading) {
    return null;
  }
  if (currentApplication.data) {
    return (
      <Card className='w-full'>
        <CardHeader className='md:flex-row max-md:flex-col w-full justify-between gap-2 md:items-start'>
          <div className='flex flex-col gap-4 justify-start'>
            <CardTitle> Leadott jelentkezés </CardTitle>
            <p>
              A most zajló, <span className='font-bold'>{currentPeriod.data?.name}</span> időszakra már sikeresen
              jelentkeztél!
            </p>
          </div>
          <div className='flex flex-col items-center gap-2 m-0 max-md:w-full'>
            <Ticket user={user.data} />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <StatusBadge status={currentApplication.data.status} />
                </TooltipTrigger>
                <TooltipContent>
                  <p className='font-sans'>Jelentkezésed jelenlegi státusza</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
      </Card>
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
            <FiFastForward />
            Jelentkezés
          </Button>
        </CardHeader>
      </Card>
    );
  } else if (lastApplication.data) {
    return (
      <Card className='w-full'>
        <CardHeader className='md:flex-row max-md:flex-col w-full justify-between gap-2 md:items-start'>
          <div className='flex flex-col gap-4 justify-start'>
            <CardTitle>Utolsó jelentkezésed</CardTitle>
          </div>
          <div className='flex flex-col items-center gap-2 m-0 max-md:w-full'>
            <Ticket user={user.data} />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <StatusBadge status={lastApplication.data.status} />
                </TooltipTrigger>
                <TooltipContent>
                  <p className='font-sans'>Jelentkezésed jelenlegi státusza</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
      </Card>
    );
  }
  return null;
}
