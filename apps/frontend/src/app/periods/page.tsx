import React from 'react';

import { mockApplications } from '@/app/mockdata/mock-data';
import { columns } from '@/app/periods/columns';
import { DataTable } from '@/app/periods/data-table';
import Th1, { Th2 } from '@/components/typography/typography';
import AdminApplicationPeriodCard from '@/components/ui/admin-application-period-card';

export default function Page() {
  const applications = mockApplications;

  return (
    <>
      <Th1>Jelentkezési időszak kezelése</Th1>
      <AdminApplicationPeriodCard period={applications[0].period} />
      <div className='m-8'>
        <Th2>Jelentkezők</Th2>
        <DataTable columns={columns} data={applications} />
      </div>
    </>
  );
}
