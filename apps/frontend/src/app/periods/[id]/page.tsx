'use client';
import { columns } from '@/app/periods/[id]/columns';
import { DataTable } from '@/app/periods/[id]/data-table';
import Th1, { Th2 } from '@/components/typography/typography';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import LoadingCard from '@/components/ui/LoadingCard';
import { Switch } from '@/components/ui/switch';
import useApplications from '@/hooks/useApplications';

export default function Page({ params }: { params: { id: number } }) {
  const { data: applications, isLoading } = useApplications(params.id);
  /*  const isLoading = true;
  const applications = mockApplications;*/

  return (
    <>
      <Th1>Jelentkezési időszak kezelése</Th1>
      {applications && (
        <Card>
          <CardHeader>
            <CardTitle>{applications[0].period}</CardTitle>
            <CardDescription />
          </CardHeader>
          <CardContent>
            <div className='flex items-center space-x-2'>
              <Switch id='airplane-mode' />
              <Label htmlFor='airplane-mode'>Az itt kiosztott belépők jelenleg érvényesek</Label>
            </div>
          </CardContent>
        </Card>
      )}
      <div>
        <Th2>Jelentkezők</Th2>
        {isLoading && <LoadingCard />}
        {applications && <DataTable columns={columns} data={applications} />}
      </div>
    </>
  );
}
