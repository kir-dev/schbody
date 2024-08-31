'use client';
import { useRouter } from 'next/navigation';

import Th1 from '@/components/typography/typography';
import ApplicationForm from '@/components/ui/ApplicationForm';
import usePeriod from '@/hooks/usePeriod';

export default function Page() {
  const { data: currentPeriod } = usePeriod();
  const router = useRouter();

  if (!currentPeriod) {
    return router.push('/');
  }
  return (
    <>
      <Th1>
        Jelentkezés <b>{currentPeriod?.name}</b> időszakra -{' '}
      </Th1>
      <ApplicationForm currentPeriod={currentPeriod} />
    </>
  );
}
