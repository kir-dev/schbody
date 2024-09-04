'use client';
import { useRouter } from 'next/navigation';
import { FiGrid, FiLogIn, FiShield, FiUser } from 'react-icons/fi';

import { Button } from '@/components/ui/button';
import useProfile from '@/hooks/useProfile';

export default function LoginButton({ version }: { version: number }) {
  const { data: user } = useProfile();
  const router = useRouter();

  const handleNavToProfile = () => {
    router.push('/profile');
  };

  const handleLogin = () => {
    router.push(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`);
  };

  return (
    <>
      {user && (
        <div className='flex gap-2 items-center'>
          {(user.role === 'BODY_MEMBER' || user.role === 'BODY_ADMIN' || user.role === 'SUPERUSER') && (
            <Button variant='secondary' onClick={() => router.push('/roles')}>
              <FiShield />
              {version === 1 ? 'Jogosultságok' : 'Jogok'}
            </Button>
          )}
          {(user.role === 'BODY_MEMBER' || user.role === 'BODY_ADMIN' || user.role === 'SUPERUSER') && (
            <Button variant='secondary' onClick={() => router.push('/periods')}>
              <FiGrid />
              {version === 1 ? 'Időszakok' : 'Idők'}
            </Button>
          )}

          <Button onClick={handleNavToProfile}>
            <FiUser />
            {version === 0 ? user.nickName.slice(0, 1) : user.nickName}
          </Button>
        </div>
      )}
      {!user && (
        <Button className='ml-0 max-md:m-2' onClick={handleLogin}>
          {version === 1 && 'Bejelentkezés'}
          {version === 0 && <FiLogIn />}
        </Button>
      )}
    </>
  );
}
