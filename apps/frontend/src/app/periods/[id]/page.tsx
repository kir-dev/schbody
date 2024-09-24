'use client';

import { useState } from 'react';

import { columns } from '@/app/periods/[id]/columns';
import { DataTable } from '@/app/periods/[id]/data-table';
import api from '@/components/network/apiSetup';
import Th1, { Th2 } from '@/components/typography/typography';
import AdminApplicationPeriodCard from '@/components/ui/AdminApplicationPeriodCard';
import { GeneratingDialog } from '@/components/ui/generating-dialog';
import LoadingCard from '@/components/ui/LoadingCard';
import useApplications from '@/hooks/useApplications';
import { usePeriod } from '@/hooks/usePeriod';
import { toast } from '@/lib/use-toast';
import { downloadPdf, getStatusKey } from '@/lib/utils';
import { ApplicationEntity, ApplicationStatus } from '@/types/application-entity';

import { ApplicationExport } from './application-export';
import { PassExport } from './pass-export';

export default function Page({ params }: { params: { id: number } }) {
  const period = usePeriod(params.id);
  const [generatingDialogOpened, setGeneratingDialogOpened] = useState(false);
  const [cacheBuster, setCacheBuster] = useState(Date.now());
  const { data: applications, isLoading: areApplicationsLoading, mutate } = useApplications(params.id);

  const handleStatusChange = async (application: ApplicationEntity, status: ApplicationStatus) => {
    const resp = await api.patch(`/application/${application.id}`, { applicationStatus: status });
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

  const onPassExport = async (data: ApplicationEntity[]) => {
    if (period?.data) {
      setGeneratingDialogOpened(true);
      await downloadPdf(
        <PassExport
          applicationData={data}
          periodName={period.data.name}
          periodId={period.data.id}
          cacheBuster={cacheBuster}
        />,
        `schbody_pass_export_${Date.now()}.pdf`
      );
      setGeneratingDialogOpened(false);
    }
  };

  const onApplicationsExport = (data: ApplicationEntity[]) => {
    if (period?.data) {
      downloadPdf(
        <ApplicationExport
          applicationData={data.filter((a) => a.status === getStatusKey(ApplicationStatus.FINISHED))}
          periodName={period.data.name}
        />,
        `schbody_applications_export_${Date.now()}.pdf`
      );
    }
  };

  if (period?.error) return <div>Hiba történt: {period?.error.message}</div>;

  return (
    <>
      <GeneratingDialog open={generatingDialogOpened} />
      <Th1>Jelentkezési időszak kezelése</Th1>
      {period?.isLoading && <LoadingCard />}
      {period?.data && (
        <AdminApplicationPeriodCard period={period.data} cacheBuster={cacheBuster} setCacheBuster={setCacheBuster} />
      )}
      <div className='mt-16'>
        <Th2>Jelentkezők</Th2>
        {areApplicationsLoading && <LoadingCard />}
        {applications && (
          <DataTable
            columns={columns(handleStatusChange)}
            data={applications}
            onStatusChange={handleStatusChange}
            onExportPassesClicked={onPassExport}
            onExportApplicationsClicked={onApplicationsExport}
          />
        )}
      </div>
    </>
  );
}
