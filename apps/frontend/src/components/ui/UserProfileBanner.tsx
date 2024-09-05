'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FiEdit2, FiLogOut, FiSave } from 'react-icons/fi';
import { RiVerifiedBadgeLine } from 'react-icons/ri';
import { useSWRConfig } from 'swr';

import ProfileImageUploadDialog from '@/app/profile/image/page';
import { Th2, TTitle } from '@/components/typography/typography';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import RoleBadge from '@/components/ui/RoleBadge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  const [cacheBuster, setCacheBuster] = useState(Date.now());
  const { mutate } = useSWRConfig();

  const handleProfilePictureUpload = async () => {
    setCacheBuster(Date.now());
  };
  const onLogout = () => {
    fetch('/auth/logout').then(() => {
      mutate(() => true, undefined, { revalidate: false });
      router.refresh();
    });
  };
  if (!props.user) return null;
  return (
    <Card className='flex max-md:flex-col md:flex-row max-md:items-center  relative'>
      <div className='min-w-44 min-h-44 md:w-1/5 max-md:w-44 h-full relative'>
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/users/${props.user.authSchId}/profile-picture?cb=${cacheBuster}`}
          alt='PROFIL KEP'
          className='md:rounded-l-xl max-md:rounded-xl max-md:my-4'
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = 'default_pfp.jpg';
            setInvalidProfilePic(true);
          }}
        />
        <div className='w-full absolute flex bottom-2'>
          <ProfileImageUploadDialog onChange={() => handleProfilePictureUpload()} />
        </div>
      </div>
      <CardContent className='w-full md:ml-4'>
        <div className='flex md:flex-row max-md:flex-col max-md:items-center max-md:gap-4 mt-10 justify-between '>
          <div className='max-md:flex max-md:flex-col max-md:items-center'>
            <div className='flex gap-2 items-start'>
              <TTitle className='mt-0'>{props.user!.fullName}</TTitle>
              {props.user.isActiveVikStudent && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <RiVerifiedBadgeLine size={36} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className='font-sans'>Igazolt VIK hallgató</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <Th2>{props.user!.neptun}</Th2>
            <RoleBadge role={props.user!.role} />
          </div>
          <div className='flex gap-4 max-lg:flex-col lg:flex-row max-md:w-full'>
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
    </Card>
  );
}
