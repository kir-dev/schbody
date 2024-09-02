'use client';
import { BodyMemberTile } from '@/components/ui/body-member-tile';
import LoadingCard from '@/components/ui/LoadingCard';
import { useUsers } from '@/hooks/useUser';

export default function MembersPage() {
  const { data, isLoading } = useUsers();

  if (!data) {
    return <div>no data available:ll</div>;
  }

  // Szűrés canHelpNoobs alapján
  const canHelpNoobsUsers = data.users.filter((u) => u.canHelpNoobs);
  const cannotHelpNoobsUsers = data.users.filter((u) => !u.canHelpNoobs);

  return (
    <main>
      <h1 className='text-3xl font-bold my-4'>Body körtagok:</h1>
      {isLoading && <LoadingCard />}

      {/*canhelpnoobs*/}
      <h2 className='text-2xl font-bold my-4'>Segíthetnek nooboknak:</h2>
      <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4'>
        {canHelpNoobsUsers.map((u) => (
          <BodyMemberTile userEntity={u} key={u.id} />
        ))}
      </div>

      {/*cant help noobs*/}
      <h2 className='text-2xl font-bold my-4'>Nem segíthetnek nooboknak:</h2>
      <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4'>
        {cannotHelpNoobsUsers.map((u) => (
          <BodyMemberTile key={u.id} userEntity={u} />
        ))}
      </div>
    </main>
  );
}
