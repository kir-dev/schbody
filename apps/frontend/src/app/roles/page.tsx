'use client';
import React from 'react';

import api from '@/components/network/apiSetup';
import Th1 from '@/components/typography/typography';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import LoadingCard from '@/components/ui/LoadingCard';
import NotFoundCard from '@/components/ui/NotFoundCard';
import OwnPagination from '@/components/ui/ownPagination';
import UserCard from '@/components/ui/UserCard';
import { useUsers } from '@/hooks/useUsers';
import { toast } from '@/lib/use-toast';
import { Role } from '@/types/user-entity';

export default function Page() {
  const [search, setSearch] = React.useState('');
  const [pageIndex, setPageIndex] = React.useState(0);
  const users = useUsers(search, pageIndex);

  async function onChange(newRole: Role, userId: string) {
    try {
      await api.patch(`/users/${userId}`, { role: newRole });
      await users.mutate();
      toast({
        title: 'Sikeresen módosítva',
      });
    } catch {
      toast({
        title: 'Hiba történt',
      });
    }
  }

  return (
    <>
      <div className='flex justify-between md:flex-row max-md:flex-col items-center'>
        <Th1>Jogosultságok kezelése</Th1>
        <div className='flex gap-2'>
          <Input
            placeholder='Keresés név alapján...'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPageIndex(0);
            }}
            className='md:max-w-sm max-md:w-full'
          />
          <Badge className='w-16 justify-end h-100'>{users.data ? <p>{users.data.totalUsers}</p> : <p>??</p>}</Badge>
        </div>
      </div>

      {search.length < 3 && (
        <OwnPagination
          props={{
            pageIndex: pageIndex,
            setPageIndex: setPageIndex,
            limit: users.data ? users.data.totalUsers : 10,
            isLoading: users.isLoading,
          }}
        />
      )}
      {users.isLoading && !users.data && <LoadingCard />}
      {users.data && users.data.users.length === 0 && <NotFoundCard />}
      <div className='grid max-lg:grid-cols-1 lg:grid-cols-2 gap-2'>
        {users.data &&
          users.data.users.map((user) => (
            <UserCard key={user.id} user={user} onChange={(newRole: Role) => onChange(newRole, user.authSchId)} />
          ))}
      </div>
      {search.length < 3 && (
        <OwnPagination
          props={{
            pageIndex: pageIndex,
            setPageIndex: setPageIndex,
            limit: users.data ? users.data.totalUsers : 10,
            isLoading: users.isLoading,
          }}
        />
      )}
    </>
  );
}
