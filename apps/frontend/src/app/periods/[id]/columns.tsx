'use client';
import { Column, ColumnDef, Row } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import ColoredBadge from '@/components/ui/ColoredBadge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ApplicationEntity, ApplicationStatus } from '@/types/application-entity';

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
      const [open, setOpen] = useState(false);
      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant='ghost'>
              <ColoredBadge status={row.original.status} onClick={() => setOpen(true)}>
                {row.original.status}
              </ColoredBadge>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Command>
              <CommandInput placeholder='Keresés...' />
              <CommandList>
                <CommandEmpty>Nincs ilyen státusz</CommandEmpty>
                <CommandGroup>
                  {Object.values(ApplicationStatus).map((status) => (
                    <CommandItem
                      key={status}
                      value={status}
                      onSelect={(value) => {
                        saveStatus(row, value as ApplicationStatus);
                        setOpen(false);
                      }}
                    >
                      <ColoredBadge status={status as ApplicationStatus} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      );
    },
  },
];

function saveStatus(row: Row<ApplicationEntity>, status: ApplicationStatus) {
  row.original.status = status;
}
