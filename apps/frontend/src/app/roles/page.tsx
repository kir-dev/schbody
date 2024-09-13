'use client';
import React from 'react';
import { FiEdit2, FiUser } from 'react-icons/fi';

import api from '@/components/network/apiSetup';
import Th1 from '@/components/typography/typography';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import LoadingCard from '@/components/ui/LoadingCard';
import NotFoundCard from '@/components/ui/NotFoundCard';
import OwnPagination from '@/components/ui/ownPagination';
import { RoleBadgeSelector } from '@/components/ui/RoleBadgeSelector';
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
    } catch (error) {
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
          }}
        />
      )}
      {users.isLoading && !users.data && <LoadingCard />}
      {users.data && users.data.users.length === 0 && <NotFoundCard />}
      <div className='grid max-md:grid-cols-1 md:grid-cols-2 gap-2'>
        {users.data &&
          users.data.users.map((user) => (
            <Card key={user.id}>
              <CardHeader className='flex flex-row w-full justify-between items-center p-4'>
                <div className='flex gap-8'>
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/users/${user.authSchId}/profile-picture`}
                    alt='KEP'
                    className='md:rounded-l-lg max-md:rounded-lg max-w-20 h-fit aspect-auto -m-4 max-md:-my-4'
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = 'default_pfp.jpg';
                    }}
                  />
                  <div>
                    <div className='flex gap-4'>
                      <CardTitle>{user.fullName}</CardTitle>
                      {user.neptun && <Badge variant='secondary'>{user.neptun.toUpperCase()}</Badge>}
                    </div>
                    <CardDescription className='flex md:gap-4 max-md:gap-0 max-md:flex-col md:flex-row mt-2'>
                      <p className='flex items-center gap-2'>
                        <FiUser />
                        {new Date(user.createdAt).toLocaleDateString('hu-HU', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                      <p className='flex items-center gap-2'>
                        <FiEdit2 />
                        {new Date(user.updatedAt).toLocaleDateString('hu-HU', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </CardDescription>
                  </div>
                </div>
                <RoleBadgeSelector
                  onChange={(newRole: Role) => onChange(newRole, user.authSchId)}
                  role={user.role as Role}
                />
              </CardHeader>
            </Card>
          ))}
      </div>
      {search.length < 3 && (
        <OwnPagination
          props={{
            pageIndex: pageIndex,
            setPageIndex: setPageIndex,
            limit: users.data ? users.data.totalUsers : 10,
          }}
        />
      )}
    </>
  );
}
