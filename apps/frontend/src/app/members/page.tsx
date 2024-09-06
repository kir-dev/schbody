'use client';
import { BodyMemberTile } from '@/components/ui/body-member-tile';
import LoadingCard from '@/components/ui/LoadingCard';
import { useMembers } from '@/hooks/useMembers';

export default function MembersPage() {
  const { data, isLoading } = useMembers();

  if (!data) {
    return <div>no data available:ll</div>;
  }

  // Szűrés canHelpNoobs alapján
  const canHelpNoobsUsers = data.filter((u) => u.canHelpNoobs);
  const cannotHelpNoobsUsers = data.filter((u) => !u.canHelpNoobs);

  return (
    <main>
      <h1 className='text-3xl font-bold my-4'>Body körtagok:</h1>
      {isLoading && <LoadingCard />}

      {/*canhelpnoobs*/}
      <h2 className='text-2xl font-bold my-4'>Vállal személyes mentorálást</h2>
      <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 border-b-2 pb-4 border-black'>
        {canHelpNoobsUsers.map((u) => (
          <BodyMemberTile userEntity={u} key={u.authSchId} />
        ))}
      </div>

      {/*cant help noobs*/}
      <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4'>
        {cannotHelpNoobsUsers.map((u) => (
          <BodyMemberTile key={u.authSchId} userEntity={u} />
        ))}
      </div>
    </main>
  );
}
