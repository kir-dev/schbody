'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import useSWR from 'swr';

import Th1 from '@/components/typography/typography';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import LoadingCard from '@/components/ui/LoadingCard';
import { axiosGetFetcher } from '@/lib/fetchers';
import { exportProfilePictures } from '@/lib/profile-pictures';
import { ProfilePictureStatus, UserEntityPagination } from '@/types/user-entity';
import { LuDownload } from 'react-icons/lu';

export default function Page() {
  const router = useRouter();
  const { data, isLoading } = useSWR<UserEntityPagination>('users?page=-1&pageSize=-1', axiosGetFetcher);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const usersWithPictures = React.useMemo(
    () => data?.users.filter((u) => u.profilePicture?.status === ProfilePictureStatus.ACCEPTED) ?? [],
    [data]
  );

  const allSelected = usersWithPictures.length > 0 && selectedIds.size === usersWithPictures.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(usersWithPictures.map((u) => u.authSchId)));
    }
  };

  const toggleUser = (authSchId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(authSchId)) {
        next.delete(authSchId);
      } else {
        next.add(authSchId);
      }
      return next;
    });
  };

  const handleExport = () => exportProfilePictures(selectedIds.size > 0 ? [...selectedIds] : undefined);

  const exportLabel = selectedIds.size === 0 ? 'mind' : `${selectedIds.size} db`;

  return (
    <>
      <div className='flex justify-between items-center flex-wrap gap-4'>
        <Th1>Profilképek exportálása</Th1>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={toggleSelectAll} disabled={usersWithPictures.length === 0}>
            {allSelected ? 'Kijelölés törlése' : 'Összes kijelölése'}
          </Button>
          <Button onClick={handleExport}>
            <LuDownload />
            Exportálás ({exportLabel})
          </Button>
        </div>
      </div>

      {isLoading && <LoadingCard />}

      {!isLoading && usersWithPictures.length === 0 && (
        <p className='text-muted-foreground'>Nincs jóváhagyott profilkép.</p>
      )}

      <div className='grid max-lg:grid-cols-1 lg:grid-cols-2 gap-2'>
        {usersWithPictures.map((user) => (
          <Card
            key={user.authSchId}
            className='flex items-center gap-4 p-4 cursor-pointer select-none'
            onClick={() => toggleUser(user.authSchId)}
          >
            <Checkbox checked={selectedIds.has(user.authSchId)} onCheckedChange={() => toggleUser(user.authSchId)} />
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/users/${user.authSchId}/profile-picture`}
              alt={user.fullName}
              loading='lazy'
              className='w-12 h-16 object-cover rounded'
            />
            <div>
              <p className='font-medium'>{user.fullName}</p>
              <p className='text-sm text-muted-foreground'>{user.nickName}</p>
            </div>
          </Card>
        ))}
      </div>

      <Button variant='secondary' onClick={() => router.push('/admin')}>
        Vissza
      </Button>
    </>
  );
}
