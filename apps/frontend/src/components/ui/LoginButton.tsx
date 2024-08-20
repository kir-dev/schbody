'use client';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import useProfile from '@/hooks/useProfile';

export default function LoginButton() {
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
          {user.fullName}
        </Button>
      )}
      {!user && (
        <Button className='m-8 ml-0 ' onClick={handleLogin}>
          Bejelentkezés
        </Button>
      )}
    </>
  );
}
