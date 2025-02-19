import React from 'react';
import { Badge } from './badge';

export default function WarningBadge() {
  return (
    <Badge hover={false} variant='red'>
      {' '}
      !!!{' '}
    </Badge>
  );
}
