'use client';

import { useState } from 'react';

import Th1 from '@/components/typography/typography';
import { ApplicationPeriodCard } from '@/components/ui/ApplicationPeriodCard';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import PeriodCreateOrEditDialog from '@/components/ui/PeriodCreateOrEditDialog';
import useApplicationPeriods from '@/hooks/usePeriod';

export default function Page() {
  const [pageIndex, setPageIndex] = useState(0);
  const periods = useApplicationPeriods(pageIndex);
  return (
    <div>
      <div className='flex justify-between md:flex-row max-md:flex-col items-center'>
        <Th1>Jelentkezési időszakok kezelése</Th1>
        <PeriodCreateOrEditDialog />
      </div>

      {periods.isLoading && 'Loading...'}
      {periods.data && periods.data.data.map((period) => <ApplicationPeriodCard key={period.id} period={period} />)}
      <Pagination>
        <PaginationContent>
          <PaginationItem
            onClick={() => {
              if (pageIndex > 0) {
                setPageIndex(pageIndex - 1);
              }
            }}
          >
            <PaginationPrevious className={pageIndex <= 0 ? 'pointer-events-none opacity-50' : ''} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href='#' isActive>
              {pageIndex + 1}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem
            onClick={() => {
              if (periods.data?.total && pageIndex < periods.data.total) {
                setPageIndex(pageIndex + 1);
              }
            }}
          >
            <PaginationNext
              className={periods.data?.total && pageIndex < periods.data.total ? '' : 'pointer-events-none opacity-50'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
