'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiEdit2, FiLogOut, FiSave } from 'react-icons/fi';
import { useSWRConfig } from 'swr';

import { Th2, TTitle } from '@/components/typography/typography';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserTimeStampsBlock } from '@/components/ui/UserTimeStampsBlock';
import { UserEntity } from '@/types/user-entity';

import RoleBadge from './RoleBadge';

export default function UserProfileBanner(props: {
  user: UserEntity | undefined;
  editingIsOn: boolean;
  onClick: () => void;
  onSubmit: () => void;
}) {
  const router = useRouter();
  const [invalidProfilePic, setInvalidProfilePic] = useState(false);
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
      <div className='min-w-44 min-h-44 w-1/4 h-full relative'>
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/users/${props.user.authSchId}/profile-picture`}
          alt='PROFIL KEP'
          className='md:rounded-l-xl max-md:rounded-xl max-md:my-4'
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = 'default_pfp.jpg';
            setInvalidProfilePic(true);
          }}
        />
        <div className='w-full absolute flex bottom-2'>
          <Link href='/profile/image' className='m-auto bg-white rounded p-2'>
            {invalidProfilePic ? 'Profilkép feltöltése' : 'Profilkép módosítása'}
          </Link>
          {/*<Dialog>
            <DialogTrigger variant='secondary' className='block m-auto' asChild>
              Profilkép módosítása
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle>Profil kép feltöltése</DialogTitle>
                <DialogDescription>Válassz egy kiváló képet magadról!</DialogDescription>
              </DialogHeader>
              <DialogContent>
                <input type='file' />
              </DialogContent>
              <DialogFooter>
                <Button type='submit'>Tovább</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>*/}
        </div>
      </div>
      <div className='w-full'>
        <div className='w-full'>
          <CardContent>
            <div className='flex md:flex-row max-md:flex-col max-md:items-center max-md:gap-4 mt-10 justify-between'>
              <div className='flex items-center gap-4'>
                <div>
                  <TTitle className='my-0'>{props.user!.fullName}</TTitle>
                  <Th2 className='ml-8'>{props.user!.neptun}</Th2>
                </div>
                <RoleBadge role={props.user!.role} />
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
      </div>
    </Card>
  );
}
