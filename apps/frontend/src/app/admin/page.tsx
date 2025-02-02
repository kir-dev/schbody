'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

import Th1 from '@/components/typography/typography';
import { Button } from '@/components/ui/button';
import { LuClipboardList, LuShield, LuUserCheck } from 'react-icons/lu';

export default function Page() {
  const router = useRouter();
  return (
    <>
      <Th1>Admin</Th1>
      <div className='flex w-full gap-4 max-lg:flex-col'>
        <Button onClick={() => router.push('/profile-picture-check')}>
          <LuUserCheck />
          Profileképek ellenőrzése
        </Button>
        <Button onClick={() => router.push('/roles')}>
          <LuShield />
          Szerepkörök kezelése
        </Button>
        <Button onClick={() => router.push('/periods')}>
          <LuClipboardList />
          Időszakok kezelése
        </Button>
      </div>
    </>
  );
}
