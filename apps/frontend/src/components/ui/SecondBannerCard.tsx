'use client';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LuFastForward } from 'react-icons/lu';

export default function SecondBannerCard() {
  const router = useRouter();
  //get current date
  const today = new Date();
  if (today.getMonth() !== 12 - 1) return null;
  return (
    <Card className='w-full my-4'>
      <CardHeader className='md:flex-row max-md:flex-col w-full justify-between gap-2 max-md:items-start md:items-center'>
        <div className='flex flex-col gap-2'>
          <CardTitle> The 2024 season comes to an end </CardTitle>
          <CardDescription>Nézd meg, mi történt Body weben az elmúlt időszakban!</CardDescription>
        </div>
        <Button className='max-md:w-full' onClick={() => router.push('/impressum/2024')}>
          <LuFastForward />
          2024 Recap
        </Button>
      </CardHeader>
    </Card>
  );
}
