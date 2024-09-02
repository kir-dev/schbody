import Link from 'next/link';
import React from 'react';

import Th1 from '@/components/typography/typography';

export default function NotFound() {
  return (
    <div>
      <Th1>Error 404</Th1>
      <p>Sajnos a keresett forrást nem találtuk</p>
      <p>Lehet, hogy a link hibás, vagy az oldal nem létezik</p>
      <Link href='/' className='underline'>
        Vissza a főoldalra
      </Link>
    </div>
  );
}
