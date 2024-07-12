import React from 'react';

import { mockApplications } from '@/app/mockdata/mock-data';
import { columns } from '@/app/periods/columns';
import { DataTable } from '@/app/periods/data-table';
import Th1, { Th2 } from '@/components/typography/typography';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function Page() {
  const applications = mockApplications;

  return (
    <>
      <Th1 text='Jelentkezési időszak kezelése' />
      <Card className='m-8'>
        <CardHeader>
          <CardTitle>{applications[0].period.name}</CardTitle>
          <CardDescription>
            {applications[0].period.applicationStart.toString().slice(0, 16)} -{' '}
            {applications[0].period.applicationEnd.toString().slice(0, 16)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-center space-x-2'>
            <Switch id='airplane-mode' />
            <Label htmlFor='airplane-mode'>Az itt kiosztott belépők jelenleg érvényesek</Label>
          </div>
        </CardContent>
      </Card>
      <div className='m-8'>
        <Th2 text='Jelentkezők' />
        <DataTable columns={columns} data={applications} />
      </div>
    </>
  );
}
