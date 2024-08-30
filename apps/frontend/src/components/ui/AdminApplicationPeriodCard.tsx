'use client';
import React from 'react';

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ApplicationPeriodEntity } from '@/types/application-period-entity';

export default function AdminApplicationPeriodCard({ period }: { period: ApplicationPeriodEntity }) {
  const deleteApplicationPeriod = () => {};

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
            <Switch id='tickets-are-valid-now' />
          </div>
          <Dialog>
            <DialogTrigger asChild className='max-md:w-full'>
              <Button>Szerkesztés</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
              <form>
                <DialogHeader>
                  <DialogTitle>Jelentkezési időszak szerkesztése</DialogTitle>
                  <DialogDescription>A változtatásaid mentés után azonnal hatályba lépnek</DialogDescription>
                </DialogHeader>
                {/*todo make it react-hook-forms and use zod to validate*/}
                <div className='mt-4'>
                  <Label htmlFor='name'>Név</Label>
                  <Input id='name' defaultValue={period.name} />
                </div>
                <div className='grid grid-cols-2 gap-4 mt-4'>
                  <div>
                    <Label htmlFor='appliction-start' className='text-right'>
                      Jelenetkezés kezdete
                    </Label>
                    <Input
                      id='appliction-start'
                      defaultValue={period.applicationPeriodStartAt.toString().toString().slice(0, 10)}
                      type='date'
                    />
                  </div>
                  <div>
                    <Label htmlFor='appliction-end' className='text-right'>
                      Jelenetkezés vége
                    </Label>
                    <Input
                      id='appliction-end'
                      type='date'
                      defaultValue={period.applicationPeriodEndAt.toString().toString().slice(0, 10)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type='submit' className='mt-4'>
                    Mentés
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
