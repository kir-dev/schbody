'use client';

import { LuGithub, LuUser } from 'react-icons/lu';

import { developers } from '@/components/data/developers';
import Th1 from '@/components/typography/typography';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { DeveloperItem } from '@/components/ui/DeveloperItem';

export default function Page() {
  return (
    <>
      <Th1>Fejlesztők</Th1>
      <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {developers.map((dev) => (
          <DeveloperItem key={dev.name} dev={dev} />
        ))}
      </div>
      <Card className='p-4 flex flex-col gap-4'>
        <CardTitle>Kir-Dev x SCHBody</CardTitle>
        <CardDescription>
          <p>
            A weboldalt az SchBody felkérésére a Kir-Dev készítette 2024 nyarán. Azóta is folyamatosan fejlesztjük és
            bővítjük a funkciókat. Köszönjük szépen a segítséget a mindenkinek, aki hozzájárult a projekt sikeréhez.
          </p>
          <p>
            Ha szeretnél bekapcsolódni a fejlesztésbe, vagy csak egy hibát találtál, nyugodtan nyiss egy issue-t / pull
            request-et GitHub-on vagy keress minket személyesen!
          </p>
        </CardDescription>

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
    </>
  );
}
