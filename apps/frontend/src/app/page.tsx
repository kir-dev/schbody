'use client';

import Th1 from '@/components/typography/typography';
import ApplicationBannerCard from '@/components/ui/ApplicationBannerCard';
import Forum from '@/components/ui/Forum';
import SecondBannerCard from '@/components/ui/SecondBannerCard';

export default function Home() {
  return (
    <main>
      <ApplicationBannerCard />
      <SecondBannerCard />
      <Th1>Hírek</Th1>
      <Forum />
    </main>
  );
}
