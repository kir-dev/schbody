import React from 'react';
import { FiEdit2, FiUser } from 'react-icons/fi';

import { CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserEntity } from '@/types/user-entity';

export function UserTimeStampsBlock({ user }: { user: UserEntity | undefined }) {
  return (
    <CardDescription className='flex max-md:justify-center md:gap-16 max-md:hidden bottom-4 absolute'>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className='flex gap-2 items-center'>
              <FiUser />
              {user?.createdAt &&
                new Date(user.createdAt!).toLocaleDateString('hu-HU', {
                  minute: 'numeric',
                  hour: 'numeric',
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}{' '}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className='font-sans'>Első bejelentkezés</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className='flex gap-2 items-center'>
              <FiEdit2 />
              {user?.createdAt &&
                new Date(user.updatedAt!).toLocaleDateString('hu-HU', {
                  minute: 'numeric',
                  hour: 'numeric',
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}{' '}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className='font-sans'>Utolsó módosítás</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </CardDescription>
  );
}
