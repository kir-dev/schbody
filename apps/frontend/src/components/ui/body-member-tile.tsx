import { Mail } from 'lucide-react';

import { MemberEntity } from '@/types/user-entity';

import { Card, CardContent, CardDescription, CardTitle } from './card';

type Props = {
  userEntity: MemberEntity;
};

export function BodyMemberTile({ userEntity }: Props) {
  return (
    <Card className='p-4 flex w-full gap-4'>
      <img
        src={`${process.env.NEXT_PUBLIC_API_URL}/users/${userEntity.authSchId}/profile-picture`}
        alt='PROFIL KEP'
        className='h-36 rounded'
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = 'default_pfp.jpg';
        }}
      />
      <div className='flex flex-col gap-4'>
        <div>
          <CardTitle>{userEntity.nickName}</CardTitle>
          <CardDescription className='mt-1'>{userEntity.fullName}</CardDescription>
        </div>
        <a href={`mailto:${userEntity.email}`} className='flex flex-row gap-2 items-center text-sm'>
          <Mail size={16} />
          {userEntity.email}{' '}
        </a>
        {userEntity.canHelpNoobs && (
          <CardContent className='text-sm p-0'>{userEntity.publicDesc ? userEntity.publicDesc : '-'}</CardContent>
        )}
      </div>
    </Card>
  );
}
