import React from 'react';

import { mockApplications } from '@/app/mockdata/mock-data';
import { columns } from '@/app/periods/columns';
import { DataTable } from '@/app/periods/data-table';
import Th1, { Th2 } from '@/components/typography/typography';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function Page() {
  const applications = mockApplications;

  return (
    <>
      <Th1>Jelentkezési időszak kezelése</Th1>
      <Card className='m-8'>
        <CardHeader className='flex flex-row w-full justify-between items-center'>
          <div>
            <CardTitle>{applications[0].period.name}</CardTitle>
            <CardDescription>
              {applications[0].period.applicationStart.toString().slice(0, 16)} -{' '}
              {applications[0].period.applicationEnd.toString().slice(0, 16)}
            </CardDescription>
          </div>
          <div className='flex items-center gap-4'>
            <div className='flex flex-row items-center justify-between rounded-lg border py-2 px-4 shadow-sm gap-4'>
              <Label htmlFor='tickets-are-valid-now'>Az itt kiosztott belépők jelenleg érvényesek</Label>
              <Switch id='tickets-are-valid-now' />
            </div>
            <Button> Szerkesztés </Button>
            <Button variant='destructive'> Törlés </Button>
          </div>
        </CardHeader>
      </Card>
      <div className='m-8'>
        <Th2>Jelentkezők</Th2>
        <DataTable columns={columns} data={applications} />
      </div>
    </>
  );
}
