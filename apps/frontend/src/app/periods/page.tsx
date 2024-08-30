'use client';

import { addDays } from 'date-fns';
import Link from 'next/link';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

import api from '@/components/network/apiSetup';
import Th1 from '@/components/typography/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePickerWithRange } from '@/components/ui/DatePickerWithRange';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 20),
  });
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<string>('');
  const applications = useApplicationPeriods(pageIndex);
  const handleCheckedChange = (value: boolean, applicationId: number) => {
    api.patch(`/application-periods/${applicationId}`, { ticketsAreValid: value }).then(() => applications.mutate());
  };

  const onSave = () => {
    if (date === undefined) return;
    api
      .post('/application-periods', {
        name,
        applicationPeriodStartAt: date.from,
        applicationPeriodEndAt: date.to,
      })
      .then(() => {
        setOpen(false);
        applications.mutate();
      });
  };
  return (
    <div>
      <div className='flex justify-between md:flex-row max-md:flex-col items-center mr-8'>
        <Th1>Jelentkezési időszakok kezelése</Th1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>+ Új jelentkezési időszak létrehozása</Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader className='mb-4'>
              <DialogTitle>Új belépőigénylési időszak</DialogTitle>
            </DialogHeader>
            <Label htmlFor='name' className='text-right'>
              Név
            </Label>
            <Input
              id='name'
              placeholder='Őszi jelentkezési időszak 2024'
              onChange={(event) => setName(event.target.value)}
              value={name}
            />

            <Label htmlFor='datepicker' className='text-right'>
              Időszak kezdete és vége
            </Label>
            <DatePickerWithRange id='datepicker' date={date} setDate={setDate} />
            <DialogFooter>
              <Button type='submit' onClick={onSave}>
                Időszak létrehozása
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {applications.isLoading && 'Loading...'}
      {applications.data &&
        applications.data.data.map((application) => (
          <Card className='mx-8 my-4 relative' key={application.id}>
            <CardHeader>
              <Link href={`/periods/${application.id}`}>
                <p className='font-mono'>#{application.id}</p>
                <CardTitle>{application.name}</CardTitle>
                <CardDescription>
                  {new Date(application.applicationPeriodStartAt).toLocaleDateString('hu-HU', {
                    minute: 'numeric',
                    hour: 'numeric',
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}{' '}
                  -{' '}
                  {new Date(application.applicationPeriodEndAt).toLocaleDateString('hu-HU', {
                    minute: 'numeric',
                    hour: 'numeric',
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </CardDescription>
              </Link>
            </CardHeader>
            {new Date(application.applicationPeriodStartAt) < new Date() &&
              new Date(application.applicationPeriodEndAt) > new Date() && (
                <Badge className='text-sm px-4 py-2 rounded absolute right-4 top-4' variant='secondary'>
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
              if (applications.data?.total && pageIndex < applications.data.total) {
                setPageIndex(pageIndex + 1);
              }
            }}
          >
            <PaginationNext
              className={
                applications.data?.total && pageIndex < applications.data.total ? '' : 'pointer-events-none opacity-50'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
