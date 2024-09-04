'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiEdit2, FiLogOut, FiSave } from 'react-icons/fi';
import { useSWRConfig } from 'swr';

import ProfileImageUploadDialog from '@/app/profile/image/page';
import { Th2, TTitle } from '@/components/typography/typography';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import RoleBadge from '@/components/ui/RoleBadge';
import { UserTimeStampsBlock } from '@/components/ui/UserTimeStampsBlock';
import { UserEntity } from '@/types/user-entity';

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
          <ProfileImageUploadDialog />
        </div>
      </div>
      <div className='w-full'>
        <CardContent>
          <div className='flex md:flex-row max-md:flex-col max-md:items-center max-md:gap-4 mt-10 justify-between'>
            <div>
              <TTitle className='mt-0'>{props.user!.fullName}</TTitle>
              <Th2>{props.user!.neptun}</Th2>
              <RoleBadge role={props.user!.role} />
            </div>
            <div className='flex gap-4 max-lg:flex-col lg:flex-row'>
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
