'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FiEdit2, FiLogOut, FiSave } from 'react-icons/fi';
import { useSWRConfig } from 'swr';

import { Th2, TTitle } from '@/components/typography/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserTimeStampsBlock } from '@/components/ui/UserTimeStampsBlock';
import { UserEntity } from '@/types/user-entity';

export default function UserProfileBanner(props: {
  user: UserEntity | undefined;
  editingIsOn: boolean;
  onClick: () => void;
  onSubmit: () => void;
}) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const onLogout = () => {
    fetch('/auth/logout').then(() => {
      mutate(() => true, undefined, { revalidate: false });
      router.refresh();
    });
  };
  if (!props.user) return null;

  return (
    <Card className='flex max-md:flex-col md:flex-row max-md:items-center'>
      <div className='min-w-44 min-h-44 w-1/4 h-full aspect-square relative'>
        <Image
          src='https://mozsarmate.me/marci.jpg'
          placeholder='blur'
          blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII='
          alt='PROFIL KEP'
          fill
          className='md:rounded-l-xl max-md:rounded-xl max-md:my-4'
        />
        <div className='w-full absolute flex bottom-2'>
          <Button variant='secondary' className='block m-auto'>
            Profilkép módosítása
          </Button>
        </div>
      </div>
      <div className='w-full'>
        <CardContent>
          <div className='flex md:flex-row max-md:flex-col max-md:items-center max-md:gap-4 mt-10 justify-between'>
            <div className='flex items-start'>
              <div>
                <TTitle className='mt-0'>{props.user!.fullName}</TTitle>
                <Th2 className='ml-8'>{props.user!.neptun}</Th2>
              </div>
              <Badge className='text-sm px-4 py-2 rounded-xl' variant='secondary'>
                {props.user!.role}
              </Badge>
            </div>
            <div className='flex gap-4'>
              {!props.editingIsOn && (
                <Button variant='secondary' onClick={props.onClick}>
                  <FiEdit2 />
                  Adatok szerkesztése
                </Button>
              )}
              {props.editingIsOn && (
                <Button type='submit'>
                  <FiSave />
                  Mentés
                </Button>
              )}
              <Button variant='destructive' onClick={onLogout}>
                <FiLogOut />
                Kijelenkezés
              </Button>
            </div>
          </div>
          <UserTimeStampsBlock user={props.user} />
        </CardContent>
      </div>
    </Card>
  );
}
