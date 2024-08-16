'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ApplicationBannerCard() {
  const router = useRouter();
  return (
    <div className='flex'>
      <Card className='mx-8 w-full bg-amber-100'>
        <CardHeader className='flex-row w-full justify-between space-y-0 items-center'>
          <div>
            <CardTitle> Jelentkezés </CardTitle>
            <CardDescription> Jelenleg folyamatban van a xxxx/yy/z jelentkezési időszak!</CardDescription>
          </div>
          <Button onClick={() => router.push('/application-form')}> Jelentkezés </Button>
        </CardHeader>
      </Card>
    </div>
  );
}
