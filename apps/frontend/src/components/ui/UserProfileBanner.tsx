'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { RiVerifiedBadgeLine } from 'react-icons/ri';
import { useSWRConfig } from 'swr';

import { Th2, TTitle } from '@/components/typography/typography';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import RoleBadge from '@/components/ui/RoleBadge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserTimeStampsBlock } from '@/components/ui/UserTimeStampsBlock';
import { UserEntity } from '@/types/user-entity';

import { LuLogOut, LuPen, LuTrash2 } from 'react-icons/lu';
import PictureDeleteDialog from './PictureDeleteDialog';
import PictureUploadDialog from './PictureUploadDialog';

export default function UserProfileBanner(props: { user: UserEntity | undefined }) {
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [cacheBuster, setCacheBuster] = useState(Date.now());
  const { mutate } = useSWRConfig();

  const handleProfilePictureAction = async () => {
    setCacheBuster(Date.now());
  };

  const handleDeleteProfilePicture = async () => {
    await handleProfilePictureAction();
    setProfilePicture(null);
  };

  const onLogout = () => {
    fetch('/auth/logout').then(() => {
      mutate(() => true, undefined, { revalidate: false });
      router.refresh();
      router.push('/');
    });
  };

  const getVerifiedBadge = () => {
    return (
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
    );
  };

  useEffect(() => {
    const getProfilePicture = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/users/${props.user!.authSchId}/profile-picture?cb=${cacheBuster}`;
        const response = await fetch(url);
        if (response.ok) {
          setProfilePicture(url);
        }
      } catch {
        setProfilePicture(null);
      }
    };

    getProfilePicture();
  }, [profilePicture, cacheBuster, props.user]);

  if (!props.user) return null;
  return (
    <Card className='flex max-md:flex-col md:flex-row max-md:items-center relative'>
      <div className='min-w-44 min-h-44 md:w-1/5 max-md:w-44 h-full relative'>
        <Image
          src={profilePicture || '/default_pfp.jpg'}
          alt='PROFIL KEP'
          className='md:rounded-l max-md:rounded-xl max-md:my-4'
          width={650}
          height={900}
          onError={({ currentTarget }) => {
            currentTarget.src = '/default_pfp.jpg';
          }}
        />
        <div className='w-full absolute flex bottom-2 gap-2 justify-center'>
          <PictureUploadDialog
            aspectRatio={650 / 900}
            modalTitle='Profilkép feltöltése'
            onChange={handleProfilePictureAction}
            endpoint='/users/me/profile-picture'
          >
            <Button className='w-fit' variant='secondary'>
              {profilePicture ? <LuPen /> : 'Kép szerkesztése'}
            </Button>
          </PictureUploadDialog>
          {profilePicture && (
            <PictureDeleteDialog
              modalTitle='Profilkép törlése'
              onChange={handleDeleteProfilePicture}
              endpoint='/users/me/profile-picture'
            >
              <Button variant='destructive'>
                <LuTrash2 />
              </Button>
            </PictureDeleteDialog>
          )}
        </div>
      </div>
      <CardContent className='w-full md:ml-4'>
        <div className='flex md:flex-row max-md:flex-col max-md:items-center max-md:gap-4 mt-10 justify-between '>
          <div className='max-md:flex max-md:flex-col max-md:items-center'>
            <div className='flex gap-2 items-start'>
              <TTitle className='mt-0'>{props.user!.fullName}</TTitle>
              {props.user.isActiveVikStudent && getVerifiedBadge()}
            </div>
            <Th2 className='mb-4'>{props.user!.neptun}</Th2>
            <RoleBadge role={props.user!.role} hover={false} />
          </div>
          <div className='max-md:w-full'>
            <Button variant='destructive' onClick={onLogout}>
              <LuLogOut />
              Kijelentkezés
            </Button>
          </div>
        </div>
        <UserTimeStampsBlock user={props.user} />
      </CardContent>
    </Card>
  );
}
