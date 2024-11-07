'use client';
import React from 'react';

import api from '@/components/network/apiSetup';
import { Th2 } from '@/components/typography/typography';
import LoadingCard from '@/components/ui/LoadingCard';
import ProfilePictureTinderCard from '@/components/ui/ProfilePictureTinderCard';
import { usePendingPictures } from '@/hooks/usePendingPictures';

export default function Page() {
  const [counter, setCounter] = React.useState(0);
  const { data, isLoading, mutate } = usePendingPictures();
  const [currentPicture, setCurrentPicture] = React.useState(0);
  const [isMutating, setIsMutating] = React.useState(false);
  const onAccept = async () => {
    if (!data) return;
    await api.patch(`users/${data![currentPicture].user.authSchId}/profile-picture/ACCEPTED`);
    await showNextPicture();
  };
  const onReject = async () => {
    if (!data) return;
    await api.patch(`users/${data![currentPicture].user.authSchId}/profile-picture/REJECTED`);
    await showNextPicture();
  };
  const onSkip = async () => {
    await showNextPicture();
  };
  const showNextPicture = async () => {
    if (!data) return;
    setIsMutating(true);
    setCounter(counter + 1);
    if (currentPicture === data!.length - 1) {
      await mutate();
      setCurrentPicture(data.length === 0 ? -1 : 0);
    } else {
      setCurrentPicture(currentPicture + 1);
    }
    setIsMutating(false);
  };

  return (
    <div className='flex flex-col items-center w-full gap-4'>
      {isLoading && <LoadingCard />}
      {data && data.length === 0 && <Th2>Nincs több kép</Th2>}
      {data && currentPicture > -1 && (
        <ProfilePictureTinderCard
          user={data[currentPicture].user}
          onAccept={onAccept}
          onReject={onReject}
          onSkip={onSkip}
          isMutating={isLoading || isMutating}
        />
      )}
      <Th2>{counter} húzás</Th2>
    </div>
  );
}
