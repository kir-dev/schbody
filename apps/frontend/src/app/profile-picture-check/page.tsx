'use client';
import React from 'react';

import api from '@/components/network/apiSetup';
import { Th2 } from '@/components/typography/typography';
import LoadingCard from '@/components/ui/LoadingCard';
import ProfilePictureTinderCard from '@/components/ui/ProfilePictureTinderCard';
import { usePendingPictures } from '@/hooks/usePendingPictures';
import { toast } from '@/lib/use-toast';
import useKeyboardShortcut from '@/lib/useKeyboardShortcut';

export default function Page() {
  const [counter, setCounter] = React.useState(0);
  const { data, isLoading, mutate } = usePendingPictures();
  const [currentPicture, setCurrentPicture] = React.useState(0);
  const onAccept = async () => {
    await api.patch(`users/${data[currentPicture].user.authSchId}/profile-picture/ACCEPTED`);
    toast({ title: 'Kép elfogadva' });
    await showNextPicture();
  };
  const onReject = async () => {
    await api.patch(`users/${data[currentPicture].user.authSchId}/profile-picture/REJECTED`);
    toast({ title: 'Kép elutasítva' });
    await showNextPicture();
  };
  const onSkip = async () => {
    await showNextPicture();
  };
  const showNextPicture = async () => {
    if (!data) return;
    setCounter(counter + 1);
    if (currentPicture === data!.length - 1) {
      await mutate();
      setCurrentPicture(0);
    } else {
      setCurrentPicture(currentPicture + 1);
    }
  };

  useKeyboardShortcut(onAccept, { code: 'ArrowLeft' });
  useKeyboardShortcut(onReject, { code: 'ArrowRight' });
  return (
    <div className='flex flex-col items-center w-full gap-4'>
      {isLoading && <LoadingCard />}
      {data && data.length === 0 && <Th2>Nincs több kép</Th2>}
      <p>{data && data.map((picture) => <span key={picture.user.authSchId}>{picture.user.fullName}, </span>)}</p>
      {data && (
        <ProfilePictureTinderCard
          user={data[currentPicture].user}
          onAccept={onAccept}
          onReject={onReject}
          onSkip={onSkip}
          isMutating={isLoading}
        />
      )}
      <Th2>{counter} húzás</Th2>
    </div>
  );
}
