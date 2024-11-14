'use client';

import Link from 'next/link';
import { LuHeart } from 'react-icons/lu';

import { Card, CardDescription } from './card';

export default function KirCard() {
  return (
    <Link href='/impressum'>
      <Card className='px-4 py-2 w-fit'>
        <CardDescription className='flex gap-1 items-center '>
          Made with <LuHeart size={14} /> by{' '}
          <span className='opacity-80 font-bold bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 text-transparent bg-clip-text'>
            Kir-Dev
          </span>
        </CardDescription>
      </Card>
    </Link>
  );
}
