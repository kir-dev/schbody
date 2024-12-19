import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserEntity } from '@/types/user-entity';

import Image from 'next/image';
import { Card, CardContent, CardTitle } from './card';

export default function Ticket({ user }: { user: UserEntity }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className='flex gap-2 p-2 bg-red-200 relative rounded-sm'>
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/users/${user.authSchId}/profile-picture?cb=${Date.now()}`}
              className='min-w-[65px] w-[65px] h-[90px] overflow-hidden rounded-sm object-cover'
              alt='kep'
              width={65}
              height={90}
            />
            <div>
              <CardTitle className='max-w-40 text-lg overflow-hidden whitespace-nowrap'>{user.fullName}</CardTitle>
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
