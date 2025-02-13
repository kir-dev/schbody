'use client';
import Hamburger from 'hamburger-react';
import Link from 'next/link';
import { useState } from 'react';

import { THeaderLink, TTitle } from '@/components/typography/typography';
import LoginButton from '@/components/ui/LoginButton';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: '/rules', title: 'Szabályzat' },
    { href: '/members', title: 'Körtagok' },
    { href: '/faq', title: 'GYIK' },
  ];

  const commonHeaderItems = (
    <>
      {links.map((link) => (
        <THeaderLink key={link.href} href={link.href} title={link.title} onClick={() => setIsOpen(false)} />
      ))}
    </>
  );

  return (
    <header className='bg-amber-200 overflow-hidden'>
      <div className='flex flex-row container mx-auto items-center justify-between'>
        <TTitle>
          <Link className='md:hidden' href='/' onClick={() => setIsOpen(false)}>
            Body
          </Link>
          <Link className='max-md:hidden' href='/' onClick={() => setIsOpen(false)}>
            SCHBody
          </Link>
        </TTitle>

        {/* Mobile view */}
        <div className='flex items-center gap-2 h-full lg:hidden'>
          <LoginButton version={0} />
          <Hamburger toggled={isOpen} toggle={setIsOpen} />
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className='absolute top-14 left-0 right-0 bg-amber-200 flex flex-col items-start lg:hidden z-50 pl-8 pb-4'>
            {/* <THeaderLink>
              <Link href='/gym'>Terem</Link>
            </THeaderLink> */}
            {commonHeaderItems}
          </div>
        )}

        {/* Desktop view */}
        <div className='hidden lg:flex items-center gap-2 h-full'>
          {/* <THeaderLink>
            <Link href='/gym'>Terem</Link>
          </THeaderLink> */}
          {commonHeaderItems}
          <LoginButton version={1} />
        </div>
      </div>
    </header>
  );
}
