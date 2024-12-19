'use client';
import { redirect } from 'next/navigation';

import Th1 from '@/components/typography/typography';
import ApplicationForm from '@/components/ui/ApplicationForm';
import LoadingCard from '@/components/ui/LoadingCard';
import useCurrentApplication from '@/hooks/useCurrentApplication';
import { useCurrentPeriod } from '@/hooks/usePeriod';

export default function Page() {
  const { data: currentPeriod, isLoading: isPeriodLoading } = useCurrentPeriod();
  const { data: application, isLoading: isApplicationLoading } = useCurrentApplication();

  if (isPeriodLoading || isApplicationLoading) {
    return <LoadingCard />;
  }

  if (!currentPeriod) {
    return redirect('/');
  }

  if (application !== undefined) {
    return redirect('/profile');
  }

  return (
    <>
      <Th1>
        Jelentkezés <b>{currentPeriod?.name}</b> időszakra
      </Th1>
      <ApplicationForm currentPeriod={currentPeriod} />
    </>
  );
}
