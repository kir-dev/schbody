import Link from 'next/link';
import { FaFacebookF } from 'react-icons/fa';
import { GrInstagram } from 'react-icons/gr';

import KirCard from '@/components/ui/KirCard';

export default function Footer() {
  return (
    <footer className='bg-amber-200 text-black p-4'>
      <div className='grid grid-cols-1 lg:grid-cols-3 w-full container mx-auto gap-4 items-center'>
        <div className='flex gap-4 justify-center lg:justify-start items-center'>
          <Link href='https://www.facebook.com/groups/schbody' target='_blank' className='flex items-center'>
            <FaFacebookF size={20} />
          </Link>
          <Link href='https://www.instagram.com/sch_body/' target='_blank' className='flex items-center'>
            <GrInstagram size={20} />
          </Link>
        </div>
        <KirCard />
        <p className='text-sm text-center lg:text-right '>&copy; 2024 SCHBody</p>
      </div>
    </footer>
  );
}
