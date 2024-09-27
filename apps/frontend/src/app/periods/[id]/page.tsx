'use client';

import { useState } from 'react';

import { columns } from '@/app/periods/[id]/columns';
import { DataTable } from '@/app/periods/[id]/data-table';
import api from '@/components/network/apiSetup';
import Th1, { Th2 } from '@/components/typography/typography';
import AdminApplicationPeriodCard from '@/components/ui/AdminApplicationPeriodCard';
import { GeneratingDialog } from '@/components/ui/generating-dialog';
import { Label } from '@/components/ui/label';
import LoadingCard from '@/components/ui/LoadingCard';
import { Switch } from '@/components/ui/switch';
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
  const [isEntryMode, setIsEntryMode] = useState(false);

  const handleStatusChange = async (application: ApplicationEntity, status: ApplicationStatus) => {
    const convertedStatus = getStatusKey(status);
    const resp = await api.patch(`/application/${application.id}`, { applicationStatus: convertedStatus });
    await mutate();
    if (resp.status === 200) {
      toast({
        title: 'Sikeres módosítás!',
        duration: 300,
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
      {!isEntryMode && (
        <div className='mb-8'>
          <Th1>Jelentkezési időszak kezelése</Th1>
          {period?.isLoading && <LoadingCard />}
          {period?.data && (
            <AdminApplicationPeriodCard
              period={period.data}
              cacheBuster={cacheBuster}
              setCacheBuster={setCacheBuster}
            />
          )}
        </div>
      )}
      <div>
        <div className='flex justify-between'>
          <Th2>Jelentkezők</Th2>
          <div className='max-md:order-1 bg-white flex flex-row items-center max-md:w-full justify-between rounded-lg border py-2 px-4 shadow-sm gap-4 md:w-fit'>
            <Label htmlFor='tickets-are-valid-now'>Beléptető mód</Label>
            <Switch id='tickets-are-valid-now' onCheckedChange={(v) => setIsEntryMode(v)} checked={isEntryMode} />
          </div>
        </div>
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
