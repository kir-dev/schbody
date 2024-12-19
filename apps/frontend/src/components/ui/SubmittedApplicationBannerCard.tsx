import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/ui/StatusBadge';
import Ticket from '@/components/ui/Ticket';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ApplicationEntity } from '@/types/application-entity';
import { ApplicationPeriodEntity } from '@/types/application-period-entity';
import { UserEntity } from '@/types/user-entity';

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
          <div className='flex flex-col gap-4 justify-start '>
            <CardTitle className='m-4'> Leadott jelentkezés </CardTitle>
            <p>
              A most zajló, <span className='font-bold'>{currentPeriod.name}</span> időszakra már sikeresen
              jelentkeztél!
            </p>
          </div>
        )}
        <div className='flex flex-col items-center gap-2 mx-2 max-md:w-full'>
          <Ticket user={user} />
          <div className='mb-1'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <StatusBadge status={application.status} />
                </TooltipTrigger>
                <TooltipContent>
                  <p className='font-sans'>Jelentkezésed státusza</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
