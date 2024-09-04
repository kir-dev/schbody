import React from 'react';
import { FiEdit2, FiUser, FiUserCheck } from 'react-icons/fi';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserEntity } from '@/types/user-entity';

export function UserTimeStampsBlock({ user }: { user: UserEntity | undefined }) {
  return (
    <div className='flex max-md:justify-center md:gap-16 max-md:hidden mx-0 my-8 mb-0'>
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
      {user?.profileSeenAt && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className='flex gap-2 items-center'>
                <FiUserCheck />
                {new Date(user.profileSeenAt!).toLocaleDateString('hu-HU', {
                  minute: 'numeric',
                  hour: 'numeric',
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}{' '}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className='font-sans'>Utolsó profil megtekintés</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
