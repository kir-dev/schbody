import React from 'react';
import { FiEdit2, FiUser, FiUserCheck } from 'react-icons/fi';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserEntity } from '@/types/user-entity';

export function UserTimeStampsBlock({ user }: { user: UserEntity | undefined }) {
  return (
    <div className='flex max-md:justify-center md:gap-16 max-md:hidden mx-0 my-8 md:mx-8 font-mono mb-0'>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <FiUser size={24} />
              {user?.createdAt?.slice(0, 10)}
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
            <span>
              <FiEdit2 size={24} />
              {user?.updatedAt?.slice(0, 10)}
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
              <span>
                <FiUserCheck size={24} />
                {user?.profileSeenAt?.slice(0, 10)}
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
