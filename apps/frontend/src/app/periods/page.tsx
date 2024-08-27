'use client';
import { useSearchParams } from 'next/navigation';

import Th1 from '@/components/typography/typography';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import useApplicationPeriods from '@/hooks/useApplicationPeriods';

export default function Page() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '0';
  const applications = useApplicationPeriods(page);

  return (
    <>
      <Th1>Jelentkezési időszakok kezelése</Th1>
      {applications.isLoading && 'Loading...'}
      {applications.data &&
        applications.data.map((application) => (
          <Card className='m-8' key={application.id}>
            <CardHeader>
              <CardTitle>{application.name}</CardTitle>
              <CardDescription>
                {application.applicationStart.toString().slice(0, 16)} -{' '}
                {application.applicationEnd.toString().slice(0, 16)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex items-center space-x-2'>
                <Switch id='airplane-mode' />
                <Label htmlFor='airplane-mode'>Az itt kiosztott belépők jelenleg érvényesek</Label>
              </div>
            </CardContent>
          </Card>
        ))}
    </>
  );
}
