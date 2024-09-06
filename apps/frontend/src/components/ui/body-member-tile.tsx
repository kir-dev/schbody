import { Mail } from 'lucide-react';

import { MemberEntity } from '@/types/user-entity';

import { Card, CardContent, CardTitle } from './card';

type Props = {
  userEntity: MemberEntity;
};

export function BodyMemberTile({ userEntity }: Props) {
  return (
    <Card className='p-5 flex w-full'>
      <img
        src={`${process.env.NEXT_PUBLIC_API_URL}/users/${userEntity.authSchId}/profile-picture`}
        alt='PROFIL KEP'
        className='h-36'
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = 'default_pfp.jpg';
        }}
      />
      <div className='flex gap-3 mx-5 flex-col'>
        <CardTitle className='font-bold flex flex-col'>
          <h1 className='text-xl font-bold'>{userEntity.nickName}</h1>
          <h3 className='text-base italic font-light'>{userEntity.fullName}</h3>
          <a
            href={`mailto:${userEntity.email}`}
            className='flex flex-row gap-1.5 mb-3 text-base font-normal items-center mt-1'
          >
            <Mail size={21} />
            {userEntity.email}{' '}
          </a>
        </CardTitle>

        <CardContent className='flex flex-col gap-1 mx-0 px-0'>
          <p>{userEntity.publicDesc}</p>
        </CardContent>
      </div>
    </Card>
  );
}
