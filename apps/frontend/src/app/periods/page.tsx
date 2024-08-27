'use client';

import { useState } from 'react';

import api from '@/components/network/apiSetup';
import Th1 from '@/components/typography/typography';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Switch } from '@/components/ui/switch';
import useApplicationPeriods from '@/hooks/useApplicationPeriods';

export default function Page() {
  const [pageIndex, setPageIndex] = useState(0);
  const applications = useApplicationPeriods(pageIndex);
  const handleCheckedChange = (value: boolean, applicationId: number) => {
    api.patch(`/application-periods/${applicationId}`, { ticketsAreValid: value }).then(() => applications.mutate());
    // if (applications.data) {
    //   applications.mutate(
    //     applications.data.map((application) => {
    //       if (application.id === applicationId) {
    //         return { ...application, ticketsAreValid: value };
    //       }
    //       return application;
    //     })
    //   );
    // }
  };
  return (
    <>
      <Th1>Jelentkezési időszakok kezelése</Th1>
      <Pagination>
        <PaginationContent>
          <PaginationItem
            onClick={() => {
              if (pageIndex === 0) return;
              setPageIndex(pageIndex - 1);
            }}
          >
            <PaginationPrevious href='#' />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href='#' isActive>
              {pageIndex + 1}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem onClick={() => setPageIndex(pageIndex + 1)}>
            <PaginationNext href='#' />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      {applications.isLoading && 'Loading...'}
      {applications.data &&
        applications.data.map((application) => (
          <Card className='m-8 relative' key={application.id}>
            <CardHeader>
              <CardTitle>{application.name}</CardTitle>
              <CardDescription>
                {new Date(application.applicationPeriodStartAt).toLocaleDateString('hu-HU', {
                  minute: 'numeric',
                  hour: 'numeric',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}{' '}
                -{' '}
                {new Date(application.applicationPeriodEndAt).toLocaleDateString('hu-HU', {
                  minute: 'numeric',
                  hour: 'numeric',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </CardDescription>
            </CardHeader>
            {new Date(application.applicationPeriodStartAt) < new Date() &&
              new Date(application.applicationPeriodEndAt) > new Date() && (
                <Badge className='text-sm px-4 py-2 rounded-xl absolute right-2 top-2' variant='secondary'>
                  Jelenleg zajlik
                </Badge>
              )}
            <CardContent>
              <div className='flex items-center space-x-2'>
                <Switch
                  id='is-valid'
                  checked={application.ticketsAreValid}
                  onCheckedChange={(value) => handleCheckedChange(value, application.id)}
                />
                <Label htmlFor='is-valid'>Az itt kiosztott belépők jelenleg érvényesek</Label>
              </div>
            </CardContent>
          </Card>
        ))}
    </>
  );
}
