import { FiGlobe } from 'react-icons/fi';

export default function LoadingCard() {
  return (
    <div className='flex flex-col items-center w-full'>
      <FiGlobe className='animate-spin' size={48} />
      <p>Töltés...</p>
    </div>
  );
}
