import React from 'react';
import { LuFileImage, LuPartyPopper, LuUserCog } from 'react-icons/lu';

import { CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserEntity } from '@/types/user-entity';

export function UserDataRow({ user }: { user: UserEntity | undefined }) {
  return (
    <CardDescription className='flex max-md:justify-center md:gap-16 max-md:hidden bottom-4 absolute'>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className='flex gap-2 items-center'>
              <LuFileImage />A profilképed elfogadásra vár
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className='font-sans'>A profilképek minden módosítás után elfogadásra szorulnak</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className='flex gap-2 items-center'>
              <LuPartyPopper />
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
              <LuUserCog />
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
