import React from 'react';
import { FiArrowLeft, FiArrowRight, FiCheck, FiX } from 'react-icons/fi';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserEntity } from '@/types/user-entity';

type ProfilePictureTinderCardProps = {
  user: UserEntity;
  onAccept: () => void;
  onReject: () => void;
  onSkip: () => void;
  isMutating: boolean;
};
export default function ProfilePictureTinderCard({
  user,
  onAccept,
  onReject,
  onSkip,
  isMutating,
}: ProfilePictureTinderCardProps) {
  return (
    <Card className='w-fit flex flex-col items-center'>
      <CardHeader>
        <CardTitle>Elfogadod ezt a képet?</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col items-center gap-4'>
        <div className='relative'>
          {isMutating && (
            <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
              <p className='text-white text-2xl'>Betöltés...</p>
            </div>
          )}
          {!isMutating && (
            <>
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/users/${user.authSchId}/profile-picture`}
                className='h-96 rounded'
              />
              <div className='absolute bottom-0 left-0 text-white bg-gradient-to-t from-black to-transparent h-fit w-full p-2 rounded-b'>
                <p className='font-bold'>{user.fullName}</p>
                <p className='text-xs'>{user.email}</p>
              </div>
            </>
          )}
        </div>
        <div className='flex gap-4'>
          <Button variant='destructive' onClick={onReject}>
            <div className='border p-0.5 text-xs rounded'>
              <FiArrowLeft />
            </div>
            <FiX />
            Elutasítom
          </Button>
          <Button variant='secondary' onClick={onSkip}>
            <FiX />
            Átugrom
          </Button>
          <Button onClick={onAccept}>
            <FiCheck />
            Elfogadom
            <div className='border p-0.5 text-xs rounded'>
              <FiArrowRight />
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
