'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FiGrid, FiShield, FiUserCheck } from 'react-icons/fi';

import Th1 from '@/components/typography/typography';
import { Button } from '@/components/ui/button';

export default function Page() {
  const router = useRouter();
  return (
    <>
      <Th1>Admin</Th1>
      <div className='flex w-full gap-4 max-lg:flex-col'>
        <Button onClick={() => router.push('/profile-picture-check')}>
          <FiUserCheck />
          Profileképek ellenőrzése
        </Button>
        <Button onClick={() => router.push('/roles')}>
          <FiShield />
          Szerepkörök kezelése
        </Button>
        <Button onClick={() => router.push('/periods')}>
          <FiGrid />
          Időszakok kezelése
        </Button>
      </div>
    </>
  );
}
