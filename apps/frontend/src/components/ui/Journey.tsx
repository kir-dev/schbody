import { ApplicationStatus } from '@/types/application-entity';
import StatusBadge from '@/components/ui/StatusBadge';

export default function Journey({ defaultStatus }: Readonly<{ defaultStatus?: ApplicationStatus }>) {
  return (
    <div className='flex gap-2'>
      {Object.entries(ApplicationStatus).map(([key]) => (
        <StatusBadge status={key as ApplicationStatus} short={(key as ApplicationStatus) !== defaultStatus} key={key} />
      ))}
    </div>
  );
}
