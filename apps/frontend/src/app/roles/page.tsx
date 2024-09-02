'use client';
import React, { useEffect } from 'react';
import { FiEdit2, FiUser } from 'react-icons/fi';

import api from '@/components/network/apiSetup';
import Th1 from '@/components/typography/typography';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import LoadingCard from '@/components/ui/LoadingCard';
import { RoleBadgeSelector } from '@/components/ui/RoleBadgeSelector';
import { useUsers } from '@/hooks/useUsers';
import { toast } from '@/lib/use-toast';
import { Role } from '@/types/user-entity';

export default function Page() {
  const users = useUsers();
  const [search, setSearch] = React.useState('');
  const [filteredUsers, setFilteredUsers] = React.useState(users.data?.users);

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

  useEffect(() => {
    if (!users.data) return;
    setFilteredUsers(users.data!.users.filter((user) => user.fullName.toLowerCase().includes(search.toLowerCase())));
  }, [search, users.data]);

  return (
    <>
      <Th1>Jogosultságok kezelése</Th1>
      {(users.isLoading || filteredUsers === undefined) && <LoadingCard />}
      {users.data && filteredUsers !== undefined && (
        <div className='flex flex-col gap-4'>
          <div className='flex justify-end w-full'>
            <Input
              placeholder='Keresés név alapján...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='max-w-sm'
            />
          </div>
          {filteredUsers!.map((user) => (
            <Card key={user.id}>
              <CardHeader className='flex md:flex-row max-md:flex-col w-full justify-between items-center'>
                <div className='max-md:w-full'>
                  <div className='flex gap-4'>
                    <CardTitle>{user.fullName}</CardTitle>
                    {user.neptun && <Badge variant='secondary'>{user.neptun}</Badge>}
                  </div>
                  <CardDescription className='flex items-center gap-4 max-md:flex-col md:flex-row mt-2'>
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
                <RoleBadgeSelector
                  onChange={(newRole: Role) => onChange(newRole, user.authSchId)}
                  role={user.role as Role}
                />
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
