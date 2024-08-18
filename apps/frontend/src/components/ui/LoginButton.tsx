'use client';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import useProfile from '@/hooks/useProfile';

export default function LoginButton() {
  const { data: user } = useProfile();
  return (
    <>
      {user && (
        <Link href='/profile'>
          <Button className='m-8 ml-0'>{user.fullName}</Button>
        </Link>
      )}
      {!user && (
        <Link href={`${process.env.NEXT_PUBLIC_API_URL}/auth/login`}>
          <Button className='m-8 ml-0'>Bejelentkezés</Button>
        </Link>
      )}
    </>
  );
}
