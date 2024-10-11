import Link from 'next/link';
import { FaFacebookF } from 'react-icons/fa';
import { GrInstagram } from 'react-icons/gr';

export default function Footer() {
  return (
    <footer className='bg-amber-200 text-black text-center p-4'>
      <div className='flex w-full gap-4 justify-center mb-4'>
        <Link href='https://www.facebook.com/groups/schbody' target='_blank'>
          <FaFacebookF size={20} />
        </Link>
        <Link href='https://www.instagram.com/sch_body/' target='_blank'>
          <GrInstagram size={20} />
        </Link>
      </div>
      <p className='text-sm'>&copy; 2024 SCHBody</p>
      <p>
        Made With Love By{' '}
        <a className='font-bold' href='https://kir-dev.hu'>
          Kir-Dev
        </a>
      </p>
      <Link className='hover:underline' href='/impressum'>
        Impresszum
      </Link>
    </footer>
  );
}
