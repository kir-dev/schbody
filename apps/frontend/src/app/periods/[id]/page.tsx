'use client';

import { pdf } from '@react-pdf/renderer';

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

import { PassExport } from './pass-export';

export default function Page({ params }: { params: { id: number } }) {
  const period = usePeriod(params.id);
  const { data: applications, isLoading: areApplicationsLoading, mutate } = useApplications(params.id);

  const handleStatusChange = async (application: ApplicationEntity, status: ApplicationStatus) => {
    const resp = await api.patch(`/application/${application}`, { applicationStatus: status });
    mutate();
    if (resp.status === 200) {
      toast({
        title: 'Sikeres módosítás!',
        duration: 1000,
      });
    } else {
      toast({
        title: 'Hiba történt!',
      });
    }
  };

  const onExport = async (data: ApplicationEntity[]) => {
    if (period?.data) {
      const blob = await pdf(<PassExport applicationData={data} periodName={period.data.name} />).toBlob();
      // eslint-disable-next-line no-undef
      const a = document.createElement('a');
      a.style.display = 'none';
      // eslint-disable-next-line no-undef
      document.body.appendChild(a);

      // eslint-disable-next-line no-undef
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = `schbody_pass_export_${Date.now()}.pdf`;
      a.click();
      // eslint-disable-next-line no-undef
      window.URL.revokeObjectURL(url);
    }
  };

  if (period?.error) return <div>Hiba történt: {period?.error.message}</div>;

  return (
    <>
      <Th1>Jelentkezési időszak kezelése</Th1>
      {period?.isLoading && <LoadingCard />}
      {period?.data && <AdminApplicationPeriodCard period={period.data} />}
      <div className='mt-16'>
        <Th2>Jelentkezők</Th2>
        {areApplicationsLoading && <LoadingCard />}
        {applications && (
          <DataTable
            columns={columns(handleStatusChange)}
            data={applications}
            onStatusChange={handleStatusChange}
            onExportClicked={onExport}
          />
        )}
      </div>
    </>
  );
}
