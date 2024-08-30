'use client';
import { columns } from '@/app/periods/[id]/columns';
import { DataTable } from '@/app/periods/[id]/data-table';
import Th1, { Th2 } from '@/components/typography/typography';
import AdminApplicationPeriodCard from '@/components/ui/AdminApplicationPeriodCard';
import LoadingCard from '@/components/ui/LoadingCard';
import useApplications from '@/hooks/useApplications';
import { usePeriod } from '@/hooks/usePeriod';

export default function Page({ params }: { params: { id: number } }) {
  const { data: period, isLoading: isPeriodLoading } = usePeriod(params.id);
  const { data: applications, isLoading: areApplicationsLoading } = useApplications(params.id);

  return (
    <>
      <Th1>Jelentkezési időszak kezelése</Th1>
      {isPeriodLoading && <LoadingCard />}
      {period && <AdminApplicationPeriodCard period={period} />}
      <div className='mt-16'>
        <Th2>Jelentkezők</Th2>
        {areApplicationsLoading && <LoadingCard />}
        {applications && <DataTable columns={columns} data={applications} />}
      </div>
    </>
  );
}
