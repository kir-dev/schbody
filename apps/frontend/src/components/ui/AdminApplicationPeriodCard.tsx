'use client';
import { useRouter } from 'next/navigation';
import { mutate } from 'swr';

import { PassExport } from '@/app/periods/[id]/pass-export';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import PeriodCreateOrEditDialog from '@/components/ui/PeriodCreateOrEditDialog';
import { Switch } from '@/components/ui/switch';
import { downloadPdf, mockApplication } from '@/lib/pdf';
import { toast } from '@/lib/use-toast';
import { ApplicationPeriodEntity } from '@/types/application-period-entity';

import Image from 'next/image';
import { Th2 } from '../typography/typography';
import PictureUploadDialog from './PictureUploadDialog';

type Props = {
  period: ApplicationPeriodEntity;
  cacheBuster: number;
  setCacheBuster: (n: number) => void;
};

export default function AdminApplicationPeriodCard({ period, cacheBuster, setCacheBuster }: Props) {
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

  const onMockExport = async () => {
    await downloadPdf(
      <PassExport
        mock
        periodId={period.id}
        applicationData={[mockApplication]}
        periodName={period.name}
        cacheBuster={cacheBuster}
      />,
      `schbody_pass_mock_export_${Date.now()}.pdf`
    );
  };

  return (
    <Card>
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
        <div className='flex md:flex-row max-md:flex-col max-md:w-full items-center gap-6'>
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
      <CardContent>
        <div className='flex max-md:flex-col md:flex-row justify-between w-full items-center'>
          <Th2 className='max-md:order-2 max-md:my-2 mb-2 text-center'>Belépő háttér</Th2>

          <div className='max-md:order-1 flex flex-row items-center max-md:w-full justify-between rounded-lg border py-2 px-4 shadow-sm gap-4'>
            <Label htmlFor='tickets-are-valid-now'>Az itt kiosztott belépők jelenleg érvényesek</Label>
            <Switch id='tickets-are-valid-now' onCheckedChange={onActiveChange} checked={period.ticketsAreValid} />
          </div>
        </div>
        <div className='flex max-md:flex-col md:flex-row gap-4 max-md:items-center md:items-end'>
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/application-periods/${period.id}/pass-bg?cb=${cacheBuster}`}
            width={75 * 4}
            height={43 * 4}
            alt='BELEPO HATTER'
            className='rounded-xl'
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = 'https://placehold.co/750x430/pink/white/jpeg';
            }}
          />
          <PictureUploadDialog
            aspectRatio={75 / 43}
            endpoint={`/application-periods/${period.id}/pass-bg`}
            modalTitle='Belépő háttér feltöltése'
            onChange={() => setCacheBuster(Date.now())}
          >
            <Button variant='secondary' className='max-md:w-full'>
              Szerkesztés
            </Button>
          </PictureUploadDialog>
          <Button variant='secondary' className='max-md:w-full' onClick={onMockExport}>
            Minta belépő generálása
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
