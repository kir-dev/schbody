'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiEdit2, FiLogOut, FiSave } from 'react-icons/fi';
import { RiVerifiedBadgeLine } from 'react-icons/ri';
import { useSWRConfig } from 'swr';

import { Th2, TTitle } from '@/components/typography/typography';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import RoleBadge from '@/components/ui/RoleBadge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserTimeStampsBlock } from '@/components/ui/UserTimeStampsBlock';
import { UserEntity } from '@/types/user-entity';

import PictureUploadDialog from './PictureUploadDialog';

export default function UserProfileBanner(props: {
  user: UserEntity | undefined;
  editingIsOn: boolean;
  setEditingIsOn: (e: boolean) => void;
  onSubmit: () => void;
}) {
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [cacheBuster, setCacheBuster] = useState(Date.now());
  const { mutate } = useSWRConfig();

  const handleProfilePictureUpload = async () => {
    setCacheBuster(Date.now());
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
      } catch (_error) {
        setProfilePicture(null);
      }
    };

    getProfilePicture();
  }, [profilePicture, cacheBuster]);

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
        <div className='w-full absolute flex bottom-2'>
          <PictureUploadDialog
            aspectRatio={650 / 900}
            modalTitle='Profilkép feltöltése'
            onChange={handleProfilePictureUpload}
            endpoint='/users/me/profile-picture'
          >
            <Button className='m-auto w-fit' variant='secondary'>
              Kép szerkesztése
            </Button>
          </PictureUploadDialog>
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
          <div className='flex gap-4 max-lg:flex-col lg:flex-row max-md:w-full'>
            {!props.editingIsOn && (
              <>
                <Button variant='secondary' onClick={() => props.setEditingIsOn(true)}>
                  <FiEdit2 />
                  Adatok szerkesztése
                </Button>
                <Button variant='destructive' onClick={onLogout}>
                  <FiLogOut />
                  Kijelentkezés
                </Button>
              </>
            )}
            {props.editingIsOn && (
              <>
                <Button type='submit'>
                  <FiSave />
                  Mentés
                </Button>
                <Button variant='destructive' onClick={() => props.setEditingIsOn(false)}>
                  Mégse
                </Button>
              </>
            )}
          </div>
        </div>
        <UserTimeStampsBlock user={props.user} />
      </CardContent>
    </Card>
  );
}
