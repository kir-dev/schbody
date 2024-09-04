'use client';
import React from 'react';

import ApplicationBannerCard from '@/components/ui/ApplicationBannerCard';
import Forum from '@/components/ui/Forum';

export default function Home() {
  return (
    <main>
      <ApplicationBannerCard />
      <Forum />
    </main>
  );
}
