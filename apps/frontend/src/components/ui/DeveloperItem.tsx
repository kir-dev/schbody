import Link from 'next/link';

import { Dev } from '../data/developers';
import { Badge } from './badge';
import { Card, CardTitle } from './card';

type Props = {
  dev: Dev;
};

export const DeveloperItem = ({ dev: { name, img, tags, github } }: Props) => {
  return (
    <Link href={github ? `https://github.com/${github}` : 'https://github.com/kir-dev'}>
      <Card style={{ wordBreak: 'break-word' }} className='flex w-full rounded-lg p-2'>
        <img
          src={img}
          alt='PROFIL KEP'
          className='h-36 rounded w-36 object-contain'
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = 'default_pfp.jpg';
          }}
        />
        <div className='flex flex-col ml-4 mt-2 gap-4'>
          <CardTitle>{name}</CardTitle>
          <div className='flex flex-wrap gap-2'>
            {tags.map((tag) => (
              <Badge key={tag} variant='orange' hover={false}>
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  );
};
