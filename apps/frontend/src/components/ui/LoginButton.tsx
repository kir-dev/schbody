'use client';
import { useRouter } from 'next/navigation';
import { FiLogIn, FiUser } from 'react-icons/fi';

import { Button } from '@/components/ui/button';
import useProfile from '@/hooks/useProfile';

enum aversion {
  LARGE,
  ICON,
}

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
        <Button className='m-8 ml-0' onClick={handleNavToProfile}>
          {version === 1 && user.fullName}
          {version === 0 && (
            <>
              <FiUser />
              {user.fullName.slice(0, 1)}
            </>
          )}
        </Button>
      )}
      {!user && (
        <Button className='m-8 ml-0 ' onClick={handleLogin}>
          {version === 1 && 'Bejelentkezés'}
          {version === 0 && <FiLogIn />}
        </Button>
      )}
    </>
  );
}
