import React from 'react';

import { Th2 } from '@/components/typography/typography';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserEntity } from '@/types/user-entity';

import { Card, CardContent, CardTitle } from './card';

export default function Ticket({ user }: { user: UserEntity }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className='flex gap-2 p-2 bg-red-200 relative'>
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/users/${user.authSchId}/profile-picture?cb=${Date.now()} `}
              className='w-[65px] h-[90px] overflow-hidden rounded object-cover'
              alt='kep'
            />
            <div>
              <CardTitle>
                <Th2 className='max-w-40 text-lg overflow-hidden whitespace-nowrap'>{user.fullName}</Th2>
              </CardTitle>
              <CardContent className='p-0'>
                <div className='bg-gray-200 rounded px-1 py-0 text-xs w-fit mt-1'>
                  <p>{user.isSchResident ? user.roomNumber : 'Külsős'}</p>
                </div>
                <div className='bg-gray-200 rounded px-1 py-0 text-xs w-fit mt-1'>
                  <p>{Math.round(Math.random() * 10000)}</p>
                </div>
                <span className='text-4xl m-0 absolute bottom-1 right-1 hover:scale-110 transition transform duration-150'>
                  🍑
                </span>
              </CardContent>
            </div>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p>Ez itt a belépőd</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
