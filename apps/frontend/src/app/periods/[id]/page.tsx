'use client';

import React, { use, useState } from 'react';

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
import { downloadPdf } from '@/lib/pdf';
import { getStatusKey } from '@/lib/status';
import { toast } from '@/lib/use-toast';
import { ApplicationEntity, ApplicationStatus } from '@/types/application-entity';

import { ApplicationExport } from './application-export';
import { PassExport } from './pass-export';

const CHUNK_SIZE = 300;

export default function Page(props: { params: Promise<{ id: number }> }) {
  const params = use(props.params);
  const period = usePeriod(params.id);
  const [generatingDialogOpened, setGeneratingDialogOpened] = useState(false);
  const [autoChangeStatusDialogOpened, setAutoChangeStatusDialogOpened] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
   * Exports the passes to a pdf. By default it exports all the selected passes, but
   * if {@link autoChangeStatus} is true,
   * it changes every selected pass's status that are currently {@link ApplicationStatus.ACCEPTED} to
   * {@link ApplicationStatus.PREPARED_FOR_PRINT}.
   */
  const onPassExport = async (data: ApplicationEntity[]) => {
    if (period?.data) {
      const autoChangeStatus = await showAutoChangeStatusDialog();

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

      /**
       * Changes the status of the applications with status {@link ApplicationStatus.ACCEPTED}
       * to {@link ApplicationStatus.PREPARED_FOR_PRINT} if autoChangeStatus is true
       */
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

  const [acceptDialogHandlers, setAcceptDialogHandlers] = React.useState<{
    onAccept: () => void;
    onDecline: () => void;
  }>();

  /**
   * Displays a dialog to confirm or decline an automatic status change.
   *
   * Set the {@link autoChangeStatus} state whether the user accepts the status change or not.
   * Also sets the handlers for the dialog buttons in the {@link acceptDialogHandlers}.
   *
   * @returns {Promise<boolean>} A promise that resolves to `true` if the user accepts the status change,
   * and `false` if the user declines.
   */
  const showAutoChangeStatusDialog = () => {
    return new Promise<boolean>((resolve) => {
      setAutoChangeStatusDialogOpened(true);

      const handleAccept = () => {
        setAutoChangeStatusDialogOpened(false);
        setAutoChangeStatus(true);
        resolve(true);
      };

      const handleDecline = () => {
        setAutoChangeStatusDialogOpened(false);
        setAutoChangeStatus(false);
        resolve(false);
      };

      setAcceptDialogHandlers({ onAccept: handleAccept, onDecline: handleDecline });
    });
  };

  /**
   * Handles the export of applications.
   * This function filters the applications by status and exports them to a PDF file.
   * After the export, the status of the exported applications is changed to
   * {@link ApplicationStatus.WAITING_FOR_OPS}.
   * This step happens after the applications have been distributed to the members, but has to be
   * exported to given to the operations team for acceptance.
   */
  const onApplicationsExport = async (data: ApplicationEntity[]) => {
    if (period?.data) {
      const autoChangeStatus = await showAutoChangeStatusDialog();

      const dataToExport = data.filter((a) => a.status === getStatusKey(ApplicationStatus.DISTRIBUTED));
      await downloadPdf(
        <ApplicationExport applicationData={dataToExport} periodName={period.data.name} />,
        `schbody_applications_export_${Date.now()}.pdf`
      );

      // Set the exported applications to "WAITING_FOR_OPS" status
      if (autoChangeStatus === true) {
        for (let i = 0; i < dataToExport.length; i++) {
          handleStatusChange(dataToExport[i], ApplicationStatus.WAITING_FOR_OPS);
        }
      }
    }
  };

  /**
   * Handles the click on the "Set to distributed" button.
   * This function sets the status of the selected applications which has the
   * status {@link ApplicationStatus.PREPARED_FOR_PRINT} to {@link ApplicationStatus.DISTRIBUTED}
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
        title='Automatikus státuszváltás'
        description='Szeretnéd, hogy az érintett applikációk státuszai automatikusan változzanak exportáláskor?'
        onAccept={() => {
          acceptDialogHandlers?.onAccept();
        }}
        onDecline={() => {
          acceptDialogHandlers?.onDecline();
        }}
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
          <div className='flex flex-row items-center gap-4'>
            {/* <div className='max-md:order-1 bg-white flex flex-row items-center max-md:w-full justify-between rounded-lg border py-2 px-4 shadow-sm gap-4 md:w-fit'>
              <Label htmlFor='automatic-status-change'>Automatikus státuszváltás exportáláskor</Label>
              <Switch
                id='automatic-status-change'
                onCheckedChange={(v) => {
                  setAutoChangeStatus(v);
                }}
                checked={autoChangeStatus}
              />
            </div> */}
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
