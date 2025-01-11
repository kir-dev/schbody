'use client';
import Th1, { Th2 } from '@/components/typography/typography';
import { BodyMemberTile } from '@/components/ui/BodyMemberTile';
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
      <Th1>Body körtagok</Th1>
      {isLoading && <LoadingCard />}

      {/*canhelpnoobs*/}
      {canHelpNoobsUsers.length > 0 && (
        <>
          <Th2>Személyes mentorálást vállaló tagok</Th2>
          <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 pb-4'>
            {canHelpNoobsUsers.map((u) => (
              <BodyMemberTile userEntity={u} key={u.authSchId} />
            ))}
          </div>
          <Th2>További körtagok</Th2>
        </>
      )}

      {/*cant help noobs*/}
      <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4'>
        {cannotHelpNoobsUsers.map((u) => (
          <BodyMemberTile key={u.authSchId} userEntity={u} />
        ))}
      </div>
    </main>
  );
}
