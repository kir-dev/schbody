'use client';
import React from 'react';

import { Th2 } from '@/components/typography/typography';
import ProfilePictureTinderCard from '@/components/ui/ProfilePictureTinderCard';
import useProfile from '@/hooks/useProfile';

export default function Page() {
  const [counter, setCounter] = React.useState(0);
  const { data, isLoading } = useProfile();
  const onAccept = async () => {
    setCounter(counter + 1);
  };
  const onReject = async () => {
    setCounter(counter + 1);
  };
  return (
    <div className='flex flex-col items-center w-full gap-4'>
      {data && <ProfilePictureTinderCard user={data} onAccept={onAccept} onReject={onReject} />}
      <Th2>{counter} húzás</Th2>
    </div>
  );
}
