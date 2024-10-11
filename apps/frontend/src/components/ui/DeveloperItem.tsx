import { Dev } from '../data/developers';
import { Badge } from './badge';
import { Card, CardTitle } from './card';

type Props = {
  dev: Dev;
};

export const DeveloperItem = ({ dev: { name, img, tags } }: Props) => {
  return (
    <Card style={{ wordBreak: 'break-word' }} className='p-4 flex w-full gap-4'>
      <img
        src={img}
        alt='PROFIL KEP'
        className='h-36 rounded'
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = 'default_pfp.jpg';
        }}
      />
      <div className='flex flex-col gap-4'>
        <CardTitle>{name}</CardTitle>
        <div className='flex flex-wrap gap-2'>
          {tags.map((tag) => (
            <Badge key={tag} variant='orange' /*TODO hover={false} */>
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};
