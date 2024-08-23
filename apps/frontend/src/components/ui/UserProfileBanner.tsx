'use client';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Th2, TTitle } from '@/components/typography/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserTimeStampsBlock } from '@/components/ui/UserTimeStampsBlock';
import useProfile from '@/hooks/useProfile';
import { UserEntity } from '@/types/user-entity';

export default function UserProfileBanner(props: {
  user: UserEntity | undefined;
  editingIsOn: boolean;
  onClick: () => void;
  onSubmit: () => void;
}) {
  const { mutate } = useProfile();
  const router = useRouter();
  const onLogout = () => {
    Cookies.remove('jwt');
    mutate(undefined, false);
    router.push('/');
  };

  return (
    <Card className='mx-8 my-4 flex max-md:flex-col md:flex-row'>
      <div className='min-w-44 min-h-44 w-1/4 h-full aspect-square relative'>
        <Image
          src='https://mozsarmate.me/marci.jpg'
          placeholder='blur'
          blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII='
          alt='PROFIL KEP'
          fill
          className='rounded-l-xl'
        />
        <div className='w-full absolute flex bottom-2'>
          <Button variant='secondary' className='block m-auto'>
            Profilkép módosítása
          </Button>
        </div>
      </div>
      <div className='w-full relative'>
        <CardContent>
          <div className='flex mt-10 justify-between'>
            <div className='flex items-start'>
              <div>
                <TTitle className='mt-0'>{props.user?.fullName}</TTitle>
                <Th2 className='ml-8'>{props.user?.neptun}</Th2>
              </div>
              {/*{user?.role !== Role.USER && (*/}
              <Badge className='text-md px-4 py-2 rounded-xl' variant='secondary'>
                {props.user?.role}
              </Badge>
              {/*)}*/}
            </div>
            <div className='flex gap-4'>
              {!props.editingIsOn && (
                <Button variant='secondary' onClick={props.onClick}>
                  Adatok szerkesztése
                </Button>
              )}
              {props.editingIsOn && <Button type='submit'>Mentés</Button>}
              <Button variant='destructive' onClick={onLogout}>
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
