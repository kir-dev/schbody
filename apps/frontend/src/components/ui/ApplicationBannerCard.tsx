'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import usePeriod from '@/hooks/usePeriod';

export default function ApplicationBannerCard() {
  const router = useRouter();
  const { data: currentPeriod } = usePeriod();
  if (!currentPeriod) {
    return null;
  }
  return (
    <div className='flex mt-8'>
      <Card className='mx-8 w-full bg-amber-100'>
        <CardHeader className='flex-row w-full justify-between space-y-0 items-center'>
          <div>
            <CardTitle> Jelentkezés </CardTitle>
            <CardDescription>
              {' '}
              Jelenleg folyamatban van a <span className='font-bold'>{currentPeriod.name}</span> jelentkezési időszak!
            </CardDescription>
          </div>
          <Button onClick={() => router.push('/application-form')}> Jelentkezés leadása </Button>
        </CardHeader>
      </Card>
    </div>
  );
}
