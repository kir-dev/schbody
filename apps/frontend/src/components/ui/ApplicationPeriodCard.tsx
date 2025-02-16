import Link from 'next/link';
import { LuHash, LuPencil, LuType, LuUser } from 'react-icons/lu';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ApplicationPeriodEntity } from '@/types/application-period-entity';

export function ApplicationPeriodCard(props: { period: ApplicationPeriodEntity }) {
  return (
    <Link href={`/periods/${props.period.id}`}>
      <Card className='my-4 relative'>
        <CardHeader className='flex max-md:flex-col md:flex-row justify-between'>
          <div>
            <CardTitle>{props.period.name}</CardTitle>
            <CardDescription className='flex gap-8 mt-2'>
              <p className='flex items-center gap-2'>
                <LuHash />
                {props.period.id}
              </p>
              <p className='flex items-center gap-2'>
                <LuUser />
                {props.period.author.fullName}
              </p>
              <p className='flex items-center gap-2'>
                <LuType />
                {props.period.createdAt.toString().slice(0, 10)}
              </p>
              <p className='flex items-center gap-2'>
                <LuPencil />
                {props.period.updatedAt.toString().slice(0, 10)}
              </p>
            </CardDescription>
          </div>
          <div className='flex items-start gap-4'>
            {new Date(props.period.applicationPeriodStartAt) < new Date() &&
              new Date(props.period.applicationPeriodEndAt) > new Date() && (
                <Badge className='text-sm px-4 py-2 rounded' variant='secondary'>
                  Jelenleg zajlik a jelentkezés
                </Badge>
              )}
            {props.period.ticketsAreValid && (
              <Badge className='text-sm px-4 py-2 rounded ' variant='secondary'>
                Az itt kiadott belépők érvényesek
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <p>
            Jelentkezés kezdete:{' '}
            {new Date(props.period.applicationPeriodStartAt).toLocaleDateString('hu-HU', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </p>
          <p>
            Jelentkezés vége:{' '}
            {new Date(props.period.applicationPeriodEndAt).toLocaleDateString('hu-HU', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
