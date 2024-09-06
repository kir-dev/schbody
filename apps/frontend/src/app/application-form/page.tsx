'use client';
import { redirect } from 'next/navigation';

import Th1 from '@/components/typography/typography';
import ApplicationForm from '@/components/ui/ApplicationForm';
import useCurrentApplication from '@/hooks/useCurrentApplication';
import { useCurrentPeriod } from '@/hooks/usePeriod';

export default function Page() {
  const { data: currentPeriod } = useCurrentPeriod();
  const application = useCurrentApplication();

  if (!currentPeriod || application.data !== undefined) {
    return redirect('/unauthorized');
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
