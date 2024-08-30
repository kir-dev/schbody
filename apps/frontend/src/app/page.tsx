'use client';
import React from 'react';

import Th1 from '@/components/typography/typography';
import ApplicationBannerCard from '@/components/ui/ApplicationBannerCard';
import Forum from '@/components/ui/Forum';
import { useUsers } from '@/hooks/useUsers';

export default function Home() {
  const { data } = useUsers();

  return (
    <main>
      {data && data.users && data.users.map((user) => <div key={user.id}>{user.name}</div>)}
      <ApplicationBannerCard />
      <Th1>Hírek</Th1>
      <Forum />
    </main>
  );
}
