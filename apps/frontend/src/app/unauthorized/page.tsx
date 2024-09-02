import LoginButton from '@/components/ui/LoginButton';

export default function UnauthorizedPage() {
  return (
    <div className='flex flex-col items-center w-full'>
      <h1>Az oldal megtekintéséhez bejelentkezés szükséges</h1>
      <LoginButton version={1} />
    </div>
  );
}
