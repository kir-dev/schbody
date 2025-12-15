'use client';

import React from 'react';
import { LuArrowRight, LuBaby, LuGithub, LuRocket, LuRotateCw, LuUser, LuUserPlus } from 'react-icons/lu';

import { developers } from '@/components/data/developers';
import Th1 from '@/components/typography/typography';
import { BodyMemberTile } from '@/components/ui/BodyMemberTile';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { DeveloperItem } from '@/components/ui/DeveloperItem';
import LoadingCard from '@/components/ui/LoadingCard';
import { useMembers } from '@/hooks/useMembers';

export default function Page() {
  const { data: bodymembers, isLoading } = useMembers();
  return (
    <>
      <Th1>2025</Th1>
      <Card className='p-4 flex flex-col gap-4'>
        <CardTitle>Kir-Dev x SCHBody</CardTitle>
        <p>
          A weboldalt az SchBody felkérésére a Kir-Dev készítette 2024 nyarán. Azóta is folyamatosan fejlesztjük és
          bővítjük a funkciókat. Ha szeretnél bekapcsolódni a fejlesztésbe, vagy csak egy hibát találtál, nyugodtan
          nyiss egy issue-t / pull request-et GitHub-on vagy keress minket személyesen!
        </p>

        <div className='flex gap-4 justify-center'>
          <Button
            onClick={() => {
              window.open('https://github.com/kir-dev/schbody');
            }}
            variant='secondary'
          >
            <LuGithub /> GitHub
          </Button>
          <Button
            onClick={() => {
              window.open('https://kir-dev.hu');
            }}
            variant='secondary'
          >
            <LuUser /> Kir-Dev
          </Button>
        </div>
      </Card>
      <Card className='p-4 flex flex-col'>
        <CardTitle>2025 számokban</CardTitle>
        <CardDescription>Tiszt</CardDescription>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-8 text-center'>
          <StatCard title='alkalommal látogattátok meg az oldalt' value={70698} icon={<LuRocket />} />
          <StatCard title='gym bro csatlakozott' value={702} icon={<LuUserPlus />} />
          <StatCard title='felhasználóval rendelkezünk' value={2053} icon={<LuUser />} />
          <StatCard title='jelentkezést adtatok le idén' value={2457} icon={<LuArrowRight />} />
          <StatCard title='vicces profilképet utasítuttunk vissza' value={78} icon={<LuBaby />} />
          <StatCard title='alkalommal halt meg KSZK-s szerverünk, Junior' value={0} icon={<LuRotateCw />} />
        </div>
        <div className='text-center w-full italic font-mono'>
          <span>az kom</span>
        </div>
      </Card>

      <Card className='p-4'>
        <CardTitle>Fejlesztők</CardTitle>
        <div className='grid  grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8'>
          {developers.map((dev) => (
            <DeveloperItem key={dev.name} dev={dev} />
          ))}
        </div>
      </Card>
      <Card className='p-4'>
        <CardTitle>Bodysok</CardTitle>
        {isLoading && <LoadingCard />}
        {bodymembers && (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 3xl:grid-cols-6 gap-4 mt-8'>
            {bodymembers.map((member) => (
              <BodyMemberTile key={member.authSchId} userEntity={member} simple />
            ))}
          </div>
        )}
      </Card>
    </>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <Card className='py-2 sm:py-4 md:py-8 px-2'>
      <span className='font-bold text-4xl md:text-6xl flex items-center gap-2 justify-center'>
        {icon}
        {value > 10000 ? `${Math.round(value / 1000)} k` : value}
      </span>
      <p>{title}</p>
    </Card>
  );
}
