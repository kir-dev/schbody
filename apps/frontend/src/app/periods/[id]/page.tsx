'use client';

import { useState } from 'react';

import { columns } from '@/app/periods/[id]/columns';
import { DataTable } from '@/app/periods/[id]/data-table';
import api from '@/components/network/apiSetup';
import Th1, { Th2 } from '@/components/typography/typography';
import { AcceptDialog } from '@/components/ui/accept-dialog';
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

const CHUNK_SIZE = 300;

export default function Page({ params }: { params: { id: number } }) {
  const period = usePeriod(params.id);
  const [generatingDialogOpened, setGeneratingDialogOpened] = useState(false);
  const [autoChangeStatusDialogOpened, setAutoChangeStatusDialogOpened] = useState(false);
  const [autoChangeStatus, setAutoChangeStatus] = useState(false);
  const [cacheBuster, setCacheBuster] = useState(Date.now());
  const { data: applications, isLoading: areApplicationsLoading, mutate } = useApplications(params.id);
  const [quickModeEnabled, setQuickModeEnabled] = useState(false);

  /**
   * Handles the status change of an application.
   *
   * This function updates the status of a given application entity by sending a PATCH request
   * to the API. If the status update is successful, it displays a success toast notification
   * and updates the local state with the new application status.
   *
   * @param {ApplicationEntity} application - The application entity whose status is to be changed.
   * @param {ApplicationStatus} status - The new status to be applied to the application.
   * @returns {Promise<void>} A promise that resolves when the status change process is complete.
   */
  const handleStatusChange = async (application: ApplicationEntity, status: ApplicationStatus) => {
    let convertedStatus = getStatusKey(status);
    if (!convertedStatus) convertedStatus = status;
    if (convertedStatus === application.status) return;
    const r = await api.patch(`/application/${application.id}`, { applicationStatus: convertedStatus });
    if (r.status === 200) {
      toast({
        title: 'Sikeres módosítás!',
        duration: 500,
      });
    } else {
      return;
    }
    const newApplication: ApplicationEntity = { ...application, status: convertedStatus as ApplicationStatus };
    await mutate(
      (oldData) => {
        if (!oldData) return [];
        return oldData.map((a) => {
          if (a.id === application.id) {
            return newApplication;
          }
          return a;
        });
      },
      { revalidate: false }
    );
  };

  /**
   * Handles the export of passes.
   * Exports the passes to a pdf. By default it exports all the selected passes, but if autoChangeStatus is true,
   * it changes every selected pass's status that are currently "ACCEPTED" to "PREPARED_FOR_PRINT".
   */
  const onPassExport = async (data: ApplicationEntity[]) => {
    if (period?.data) {
      setAutoChangeStatusDialogOpened(true);
      setGeneratingDialogOpened(true);
      for (let i = 0; i < data.length; i += CHUNK_SIZE) {
        await downloadPdf(
          <PassExport
            applicationData={data.slice(i, i + CHUNK_SIZE)}
            periodName={period.data.name}
            periodId={period.data.id}
            cacheBuster={cacheBuster}
          />,
          `schbody_pass_export_${Date.now()}.pdf`
        );
      }

      // Changes the status of the applications with status "ACCEPTED"
      // to "PREPARED_FOR_PRINT" if autoChangeStatus is true
      if (autoChangeStatus === true) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].status === getStatusKey(ApplicationStatus.ACCEPTED)) {
            handleStatusChange(data[i], ApplicationStatus.PREPARED_FOR_PRINT);
          }
        }
      }
      setGeneratingDialogOpened(false);
    }
  };

  /**
   * Handles the export of applications.
   * This function filters the applications by status and exports them to a PDF file.
   * After the export, the status of the exported applications is changed to "WAITING_FOR_OPS".
   * This step happens after the applications have been distributed to the members, but has to be
   * exported to given to the operations team for acceptance.
   */
  const onApplicationsExport = (data: ApplicationEntity[]) => {
    if (period?.data) {
      const dataToExport = data.filter((a) => a.status === getStatusKey(ApplicationStatus.DISTRIBUTED));
      downloadPdf(
        <ApplicationExport applicationData={dataToExport} periodName={period.data.name} />,
        `schbody_applications_export_${Date.now()}.pdf`
      );

      // Set the exported applications to "WAITING_FOR_OPS" status
      for (let i = 0; i < dataToExport.length; i++) {
        handleStatusChange(dataToExport[i], ApplicationStatus.WAITING_FOR_OPS);
      }
    }
  };

  /**
   * Handles the click on the "Set to distributed" button.
   * This function sets the status of the selected applications which has the
   * status "PREPARED_TO_PRINT" to "DISTRIBUTED", .
   */
  const onSetToDistributedClicked = async (data: ApplicationEntity[]) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].status === getStatusKey(ApplicationStatus.PREPARED_FOR_PRINT)) {
        handleStatusChange(data[i], ApplicationStatus.DISTRIBUTED);
      }
    }
  };

  if (period?.error) return <div>Hiba történt: {period?.error.message}</div>;

  return (
    <div className={quickModeEnabled ? '2xl:-mx-64 xl:-mx-32 max-xl:-mx-8 max-md:-mx-4 px-4 py-0 -mt-4' : ''}>
      <GeneratingDialog open={generatingDialogOpened} />
      <AcceptDialog
        open={autoChangeStatusDialogOpened}
        onAccept={() => {
          setAutoChangeStatusDialogOpened(false);
          setAutoChangeStatus(true);
        }}
        onDecline={() => {
          setAutoChangeStatusDialogOpened(false);
          setAutoChangeStatus(false);
        }}
        title='Automatikus státuszváltás'
        description='Az állapot átállításával a jelentkezők a következő státuszba kerülnek: NYOMTATÁSRA ELŐKÉSZÍTETT'
      />
      {!quickModeEnabled && (
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
            <Label htmlFor='tickets-are-valid-now'>Grind mód</Label>
            <Switch
              id='tickets-are-valid-now'
              onCheckedChange={(v) => {
                setQuickModeEnabled(v);
              }}
              checked={quickModeEnabled}
            />
          </div>
        </div>
        {areApplicationsLoading && <LoadingCard />}
        {applications && (
          <DataTable
            columns={columns(quickModeEnabled, handleStatusChange)}
            data={applications}
            onStatusChange={handleStatusChange}
            onExportPassesClicked={onPassExport}
            onExportApplicationsClicked={onApplicationsExport}
            onSetToDistributedClicked={onSetToDistributedClicked}
          />
        )}
      </div>
    </div>
  );
}
