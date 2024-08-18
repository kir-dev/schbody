import Link from 'next/link';

import { THeaderLink, TTitle } from '@/components/typography/typography';
import LoginButton from '@/components/ui/LoginButton';

export default function Header() {
  return (
    <header>
      <div className='flex w-full h-16 bg-amber-200 items-center justify-between'>
        <TTitle>
          <Link href='/'>SchBody</Link>
        </TTitle>
        <div className='flex items-center gap-8'>
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
          <LoginButton />
        </div>
      </div>
    </header>
  );
}
