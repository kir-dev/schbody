'use client';
import React from 'react';

import Th1 from '@/components/typography/typography';
import ApplicationBannerCard from '@/components/ui/ApplicationBannerCard';
import Forum from '@/components/ui/Forum';

export default function Home() {
  return (
    <main>
      <ApplicationBannerCard />
      <Th1>Hírek</Th1>
      <Forum />
    </main>
  );
}
