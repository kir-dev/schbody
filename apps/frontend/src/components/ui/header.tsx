import Link from 'next/link';

import { THeaderLink, TTitle } from '@/components/typography/typography';
import LoginButton from '@/components/ui/LoginButton';

export default function Header() {
  return (
    <header>
      <div className='flex flex-row w-full h-16 bg-pink-200 items-center justify-between'>
        <TTitle>
          <Link href='/'>SCHBody</Link>
        </TTitle>
        <div className='flex items-center max-md:hidden gap-8 h-full'>
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
        <div className='flex items-center max-md:overflow-scroll gap-4 h-full md:hidden'>
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
        <div className='flex items-center h-16 md:hidden ml-2'>
          <LoginButton version={0} />
        </div>
      </div>
    </header>
  );
}
