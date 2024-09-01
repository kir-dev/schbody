import Image from 'next/image';

import { UserEntity } from '@/types/user-entity';

import { Card, CardContent, CardTitle } from './card';

type Props = {
  userEntity: UserEntity;
};

export function BodyMemberTile({ userEntity }: Props) {
  return (
    <Card className='p-5 flex h-40 w-full'>
      <div>
        <Image src='https://mozsarmate.me/marci.jpg' width={100} height={100} alt='@shadcn' />
      </div>
      <div className='flex gap-3 mx-5 flex-col'>
        <CardTitle className='font-bold'>
          {userEntity.fullName} ({userEntity.nickName})
        </CardTitle>

        <CardContent className='flex flex-col gap-1 mx-1'>
          <p>elérhetőség: {userEntity.email}</p>
          <p>{userEntity.publicDesc}</p>
        </CardContent>
      </div>
    </Card>
  );
}
