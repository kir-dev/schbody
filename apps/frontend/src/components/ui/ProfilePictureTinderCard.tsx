import React from 'react';
import { FiArrowLeft, FiArrowRight, FiCheck, FiX } from 'react-icons/fi';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserEntity } from '@/types/user-entity';

type ProfilePictureTinderCardProps = {
  user: UserEntity;
  onAccept: () => void;
  onReject: () => void;
};
export default function ProfilePictureTinderCard({ user, onAccept, onReject }: ProfilePictureTinderCardProps) {
  return (
    <Card className='w-fit flex flex-col items-center'>
      <CardHeader>
        <CardTitle>Elfogadod ezt a képet?</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col items-center gap-4'>
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/users/${user.authSchId}/profile-picture`}
          className='h-80 rounded'
        />
        <div className='flex flex-col items-center'>
          <p className='font-bold'>{user.fullName}</p>
          <p>{user.email}</p>
        </div>
        <div className='flex gap-4'>
          <Button variant='destructive' onClick={onReject}>
            <div className='border p-0.5 text-xs rounded'>
              <FiArrowLeft />
            </div>
            <FiX />
            Elutasítom
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
