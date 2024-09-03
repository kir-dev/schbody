'use client';
import Hamburger from 'hamburger-react';
import Link from 'next/link';
import { useState } from 'react';

import { THeaderLink, TTitle } from '@/components/typography/typography';
import LoginButton from '@/components/ui/LoginButton';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className='bg-amber-200'>
      <div className='flex flex-row 2xl:mx-64 xl:mx-32 max-xl:mx-8 items-center justify-between'>
        <TTitle>
          <Link href='/'>SCHBody</Link>
        </TTitle>

        {/* Mobile view */}
        <div className='flex items-center gap-2 h-full md:hidden'>
          <LoginButton version={0} />
          <Hamburger toggled={isOpen} toggle={setIsOpen} />
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className='absolute top-14 left-0 right-0 bg-amber-200 flex flex-col items-start md:hidden z-50 pl-8 pb-4'>
            <THeaderLink>
              <Link href='/gym'>Terem</Link>
            </THeaderLink>
            <THeaderLink>
              <Link href='/rules'>Szabályzat</Link>
            </THeaderLink>
            <THeaderLink>
              <Link href='/members'>Körtagok</Link>
            </THeaderLink>
            <THeaderLink>
              <Link href='/faq'>GYIK</Link>
            </THeaderLink>
          </div>
        )}

        {/* Desktop view */}
        <div className='hidden md:flex items-center gap-2 h-full'>
          <THeaderLink>
            <Link href='/gym'>Terem</Link>
          </THeaderLink>
          <THeaderLink>
            <Link href='/rules'>Szabályzat</Link>
          </THeaderLink>
          <THeaderLink>
            <Link href='/members'>Körtagok</Link>
          </THeaderLink>
          <THeaderLink>
            <Link href='/faq'>GYIK</Link>
          </THeaderLink>
          <LoginButton version={1} />
        </div>
      </div>
    </header>
  );
}
