'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { mutate } from 'swr';

import api from '@/components/network/apiSetup';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import PeriodCreateOrEditDialog from '@/components/ui/PeriodCreateOrEditDialog';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/lib/use-toast';
import { ApplicationPeriodEntity } from '@/types/application-period-entity';

export default function AdminApplicationPeriodCard({ period }: { period: ApplicationPeriodEntity }) {
  const router = useRouter();
  const deleteApplicationPeriod = async () => {
    const response = await api.delete(`/application-periods/${period.id}`).catch((e) => {
      toast({
        title: 'Hiba történt!',
        description: e.message,
      });
    });
    if (response && response.status === 200) {
      router.push('/periods');
    } else {
      toast({
        title: 'Hiba történt!',
        description: response ? response.statusText : 'Ismeretlen hiba',
      });
    }
  };

  const onActiveChange = async (value: boolean) => {
    await api.patch(`/application-periods/${period.id}`, { ticketsAreValid: value }).catch((e) => {
      toast({
        title: 'Hiba történt!',
        description: e.message,
      });
    });
    await mutate(`/application-periods/${period.id}`);
  };

  return (
    <Card className=''>
      <CardHeader className='flex md:flex-row max-md:flex-col w-full justify-between items-center'>
        <div className='max-md:w-full'>
          <CardTitle>{period.name}</CardTitle>
          <CardDescription>
            {new Date(period.applicationPeriodStartAt).toLocaleDateString('hu-HU', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
            {' - '}
            {new Date(period.applicationPeriodEndAt).toLocaleDateString('hu-HU', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </CardDescription>
        </div>
        <div className='flex md:flex-row max-md:flex-col max-md:w-full items-center gap-4'>
          <div className='flex flex-row items-center max-md:w-full justify-between rounded-lg border py-2 px-4 shadow-sm gap-4'>
            <Label htmlFor='tickets-are-valid-now'>Az itt kiosztott belépők jelenleg érvényesek</Label>
            <Switch id='tickets-are-valid-now' onCheckedChange={onActiveChange} checked={period.ticketsAreValid} />
          </div>
          <PeriodCreateOrEditDialog period={period} />
          <AlertDialog>
            <AlertDialogTrigger asChild className='max-md:w-full'>
              <Button variant='destructive'> Törlés </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Teljesen biztos vagy benne?</AlertDialogTitle>
                <AlertDialogDescription>
                  A törlés nem visszafordítható! Az időszakkal együtt az összes jelentkezés is törlődni fog!
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Mégse</AlertDialogCancel>
                <AlertDialogAction onClick={deleteApplicationPeriod}>Törlés</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
    </Card>
  );
}
