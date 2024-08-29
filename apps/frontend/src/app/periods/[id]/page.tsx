import { mockApplications } from '@/app/mockdata/mock-data';
import { columns } from '@/app/periods/[id]/columns';
import { DataTable } from '@/app/periods/[id]/data-table';
import Th1, { Th2 } from '@/components/typography/typography';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function Page() {
  const applications = mockApplications;

  return (
    <>
      <Th1>Jelentkezési időszak kezelése</Th1>
      <Card className='m-8'>
        <CardHeader>
          <CardTitle>{applications[0].period.name}</CardTitle>
          <CardDescription>
            {applications[0].period.applicationPeriodStartAt.toString().slice(0, 16)} -{' '}
            {applications[0].period.applicationPeriodEndAt.toString().slice(0, 16)}
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
        <Th2>Jelentkezők</Th2>
        <DataTable columns={columns} data={applications} />
      </div>
    </>
  );
}
