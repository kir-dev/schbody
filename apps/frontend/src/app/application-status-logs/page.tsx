'use client';
import React from 'react';

import { columns } from '@/app/application-status-logs/columns';
import { DataTable } from '@/app/application-status-logs/data-table';
import Th1 from '@/components/typography/typography';
import LoadingCard from '@/components/ui/LoadingCard';
import { useApplicationStatusLogs } from '@/hooks/useApplicationStatusLogs';

export default function Page() {
  const { data, isLoading, error } = useApplicationStatusLogs();

  if (error) return <div>Hiba történt: {error.message}</div>;

  return (
    <div>
      <Th1>Jelentkezési státusznapló</Th1>
      {isLoading && !data && <LoadingCard />}
      {data && <DataTable columns={columns} data={data} />}
    </div>
  );
}
