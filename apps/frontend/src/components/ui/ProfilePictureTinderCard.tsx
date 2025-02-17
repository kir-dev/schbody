import React, { useState } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useKeyboardShortcut } from '@/lib/useKeyboardShortcut';
import { UserEntity } from '@/types/user-entity';

type ProfilePictureTinderCardProps = {
  user: UserEntity;
  onAccept: () => Promise<void>;
  onReject: () => Promise<void>;
  onSkip: () => Promise<void>;
  isMutating: boolean;
};

export default function ProfilePictureTinderCard({
  user,
  onAccept,
  onReject,
  onSkip,
  isMutating,
}: ProfilePictureTinderCardProps) {
  const [slideDirection, setSlideDirection] = useState<string | null>(null);
  const [isSliding, setIsSliding] = useState(false);

  const handleSlideOut = async (direction: 'left' | 'right') => {
    setIsSliding(true);
    setSlideDirection(direction);

    if (direction === 'left') {
      await onReject().then(() => {
        setTimeout(() => {
          setIsSliding(false);
          setSlideDirection(null);
        }, 200);
      });
    } else {
      await onAccept().then(() => {
        setTimeout(() => {
          setIsSliding(false);
          setSlideDirection(null);
        }, 200);
      });
    }
  };

  useKeyboardShortcut(['f'], () => handleSlideOut('left'));
  useKeyboardShortcut(['j'], () => handleSlideOut('right'));

  return (
    <Card className='w-fit flex flex-col items-center overflow-hidden'>
      <CardHeader>
        <CardTitle>Elfogadod ezt a képet?</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col items-center gap-4'>
        <div className='relative'>
          <div
            className={`overflow-hidden rounded transition-all duration-500 ${
              slideDirection === 'left' ? '-translate-x-96 opacity-0' : ''
            } ${slideDirection === 'right' ? 'translate-x-96 opacity-0' : ''} ${
              isSliding ? '' : 'translate-x-0 opacity-100 duration-150 transition-opacity'
            }`}
          >
            <img
              src={
                isMutating
                  ? '/images/placeholder.png'
                  : `${process.env.NEXT_PUBLIC_API_URL}/users/${user.authSchId}/profile-picture?cb=${Date.now()}`
              }
              className='h-96 rounded hover:animate-zoom-in object-cover w-72'
            />
            <div className='absolute bottom-0 left-0 text-white bg-gradient-to-t from-black to-transparent h-fit w-full p-2 rounded-b'>
              <p className='font-bold'>{isMutating ? 'Betöltés' : user.fullName}</p>
              <p className='text-xs'>{isMutating ? '...' : user.email}</p>
            </div>
          </div>
        </div>
        <div className='flex gap-4'>
          <Button variant='destructive' onClick={() => handleSlideOut('left')}>
            <div className='border p-0.5 text-xs rounded  px-1.5'>F</div>
            <FiX />
          </Button>
          <Button variant='secondary' onClick={onSkip}>
            Átugrom
          </Button>
          <Button onClick={() => handleSlideOut('right')}>
            <FiCheck />
            <div className='border p-0.5 text-xs rounded px-1.5'>J</div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
