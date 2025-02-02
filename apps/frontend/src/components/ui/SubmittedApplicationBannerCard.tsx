import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import Ticket from '@/components/ui/Ticket';
import { ApplicationEntity } from '@/types/application-entity';
import { ApplicationPeriodEntity } from '@/types/application-period-entity';
import { UserEntity } from '@/types/user-entity';
import Journey from '@/components/ui/Journey';
import StatusBadge from '@/components/ui/StatusBadge';

type Props = {
  user: UserEntity;
  application: ApplicationEntity;
  currentPeriod?: ApplicationPeriodEntity;
};
export default function SubmittedApplicationBannerCard({ user, application, currentPeriod }: Props) {
  return (
    <Card className='w-full'>
      <CardHeader className='md:flex-row max-md:flex-col justify-between gap-2 md:items-start p-2'>
        {!currentPeriod && <CardTitle className='m-4'>Utolsó jelentkezésed</CardTitle>}
        {currentPeriod && (
          <div className='flex flex-col gap-4 justify-start m-4'>
            <CardTitle> Leadott jelentkezés </CardTitle>
            <p>
              A most zajló, <span className='font-bold'>{currentPeriod.name}</span> időszakra már sikeresen
              jelentkeztél!
            </p>
          </div>
        )}
        <div className='flex flex-col items-center md:items-end gap-2 mx-2 max-md:w-full mb-1'>
          <Ticket user={user} />
          <div className='max-md:hidden'>
            <Journey defaultStatus={application.status}></Journey>
          </div>
          <div className='md:hidden'>
            <StatusBadge status={application.status} />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
