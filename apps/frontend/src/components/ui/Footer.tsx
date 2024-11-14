import Link from 'next/link';
import { FaFacebookF } from 'react-icons/fa';
import { GrInstagram } from 'react-icons/gr';

import KirCard from '@/components/ui/KirCard';

export default function Footer() {
  return (
    <footer className='bg-amber-200 text-black p-4'>
      <div className='flex gap-4 container mx-auto items-center justify-between'>
        <div className='flex gap-4 justify-center'>
          <Link href='https://www.facebook.com/groups/schbody' target='_blank'>
            <FaFacebookF size={20} />
          </Link>
          <Link href='https://www.instagram.com/sch_body/' target='_blank'>
            <GrInstagram size={20} />
          </Link>
        </div>
        <KirCard />
        <p className='text-sm'>&copy; 2024 SCHBody</p>
      </div>
    </footer>
  );
}
