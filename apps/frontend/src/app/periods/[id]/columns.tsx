'use client';
import { Column, ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ApplicationEntity } from '@/types/application-entity';

function SortableHeader(column: Column<ApplicationEntity>, title: string) {
  return (
    <div className=' flex h-4 items-center gap-4'>
      {title}
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        <ArrowUpDown className='w-4 h-4' />
      </Button>
    </div>
  );
}

export const columns: ColumnDef<ApplicationEntity>[] = [
  {
    id: 'Választ',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(Boolean(value))}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
        aria-label='Sor kijelölése'
      />
    ),
  },
  {
    id: 'Név',
    accessorKey: 'user.fullName',
    header: ({ column }) => {
      return SortableHeader(column, 'Név');
    },
  },
  {
    id: 'Kontakt',
    accessorKey: 'user.email',
    header: ({ column }) => {
      return SortableHeader(column, 'Kontakt');
    },
  },
  {
    id: 'Leadva',
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return SortableHeader(column, 'Leadva');
    },
  },
  {
    id: 'Státusz',
    accessorKey: 'status',
    header: ({ column }) => {
      return SortableHeader(column, 'Státusz');
    },
    cell: ({ row }) => {
      return <Badge>{row.getValue('Státusz')}</Badge>;
    },
  },
];
