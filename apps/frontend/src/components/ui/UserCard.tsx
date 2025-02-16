import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RoleBadgeSelector } from '@/components/ui/RoleBadgeSelector';
import { Role, UserEntity } from '@/types/user-entity';
import Image from 'next/image';
import { LuPencil, LuUser } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import api from '../network/apiSetup';
import { toast } from '@/lib/use-toast';

export default function UserCard(props: { user: UserEntity; onChange: (newRole: Role) => Promise<void> }) {
  async function sendStatusChange(string: string) {
    const resp = await api.patch('/users/' + props.user.authSchId + '/profile-picture/' + string);
    toast({
      title: 'Módosítás!',
      description: resp.statusText,
    });
  }

  return (
    <Card>
      <CardHeader className='flex flex-row w-full justify-between items-center p-4 overflow-auto gap-4'>
        <div className='flex gap-8'>
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/users/${props.user.authSchId}/profile-picture`}
            alt='KEP'
            className='lg:rounded-l-lg max-lg:rounded-lg h-auto aspect-auto -m-4 max-md:-my-4'
            width={128}
            height={128}
          />
          <div className='overflow-scroll text-nowrap truncate justify-between flex flex-col h-auto'>
            <CardTitle>{props.user.fullName}</CardTitle>
            <CardDescription className='flex sm:gap-4 max-sm:gap-0 max-sm:flex-col sm:flex-row'>
              <p className='flex items-center gap-2'>
                <LuUser />
                {new Date(props.user.createdAt).toLocaleDateString('hu-HU', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
              <p className='flex items-center gap-2'>
                <LuPencil />
                {new Date(props.user.updatedAt).toLocaleDateString('hu-HU', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </CardDescription>
          </div>
        </div>
        <div className='flex flex-col gap-1'>
          <Button key={'a'} onClick={() => sendStatusChange('ACCEPTED')}>
            OK
          </Button>
          <Button key={'b'} onClick={() => sendStatusChange('PENDING')}>
            Pending
          </Button>
          <Button key={'c'} onClick={() => sendStatusChange('REJECTED')}>
            Elutasít
          </Button>
        </div>
        <div className='flex-2'>
          <RoleBadgeSelector onChange={props.onChange} role={props.user.role as Role} />
        </div>
      </CardHeader>
    </Card>
  );
}
