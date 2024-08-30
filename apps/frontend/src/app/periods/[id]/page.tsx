'use client';
import { columns } from '@/app/periods/[id]/columns';
import { DataTable } from '@/app/periods/[id]/data-table';
import api from '@/components/network/apiSetup';
import Th1, { Th2 } from '@/components/typography/typography';
import AdminApplicationPeriodCard from '@/components/ui/AdminApplicationPeriodCard';
import LoadingCard from '@/components/ui/LoadingCard';
import useApplications from '@/hooks/useApplications';
import { usePeriod } from '@/hooks/usePeriod';
import { toast } from '@/lib/use-toast';
import { ApplicationEntity, ApplicationStatus } from '@/types/application-entity';

export default function Page({ params }: { params: { id: number } }) {
  const { data: period, isLoading: isPeriodLoading, error } = usePeriod(params.id);
  const { data: applications, isLoading: areApplicationsLoading, mutate } = useApplications(params.id);

  const handleStatusChange = async (row: ApplicationEntity, status: ApplicationStatus) => {
    const resp = await api.patch(`/application/1`, { applicationStatus: getStatusKey(status) });
    mutate();
    if (resp.status === 200) {
      toast({
        title: 'Sikeres módosítás!',
      });
    } else {
      toast({
        title: 'Hiba történt!',
      });
    }
  };
  function getStatusKey(status: ApplicationStatus): string | undefined {
    const statusEntries = Object.entries(ApplicationStatus) as [string, ApplicationStatus][];
    for (const [key, value] of statusEntries) {
      if (value === status) {
        return key;
      }
    }
    return undefined;
  }

  if (error) return <div>Hiba történt: {error.message}</div>;

  return (
    <>
      <Th1>Jelentkezési időszak kezelése</Th1>
      {isPeriodLoading && <LoadingCard />}
      {period && <AdminApplicationPeriodCard period={period} />}
      <div className='mt-16'>
        <Th2>Jelentkezők</Th2>
        {areApplicationsLoading && <LoadingCard />}
        {applications && <DataTable columns={columns(handleStatusChange)} data={applications} />}
      </div>
    </>
  );
}
