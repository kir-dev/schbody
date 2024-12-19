import { Mail } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { MemberEntity } from '@/types/user-entity';

import { Card, CardContent, CardDescription, CardTitle } from './card';

type Props = {
  userEntity: MemberEntity;
  simple?: boolean;
};

export function BodyMemberTile({ userEntity, simple }: Props) {
  return (
    <Card style={{ wordBreak: 'break-word' }} className='p-2 flex w-full'>
      <img
        src={`${process.env.NEXT_PUBLIC_API_URL}/users/${userEntity.authSchId}/profile-picture`}
        alt='PROFIL KEP'
        className='h-36 rounded'
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = '/default_pfp.jpg';
        }}
      />
      <div className='flex flex-col gap-4 ml-4 mt-2'>
        <CardTitle>{userEntity.nickName}</CardTitle>
        {simple && userEntity.role === 'BODY_ADMIN' && <Badge variant='rose'>Admin</Badge>}
        {!simple && (
          <div className='flex flex-col gap-2'>
            <CardDescription className='mt-1'>{userEntity.fullName}</CardDescription>
            <a href={`mailto:${userEntity.email}`} className='flex flex-row gap-2 items-center text-sm'>
              <Mail size={16} style={{ minWidth: '16px' }} />
              {userEntity.email}
            </a>
            {userEntity.canHelpNoobs && (
              <CardContent className='text-sm p-0'>{userEntity.publicDesc ? userEntity.publicDesc : '-'}</CardContent>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
