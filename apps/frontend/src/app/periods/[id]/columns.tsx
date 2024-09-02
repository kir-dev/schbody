'use client';
import { Column, ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import ColoredBadge from '@/components/ui/ColoredBadge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ApplicationEntity2, ApplicationStatus } from '@/types/application-entity';

function SortableHeader(column: Column<ApplicationEntity2>, title: string) {
  return (
    <div className=' flex h-4 items-center gap-4'>
      {title}
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        <ArrowUpDown className='w-4 h-4' />
      </Button>
    </div>
  );
}

export const columns: (
  onStatusChange: (row: ApplicationEntity2, status: ApplicationStatus) => void
) => ColumnDef<ApplicationEntity2>[] = (onStatusChange) => [
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
    cell: ({ row }) => {
      return (
        <span>
          {new Date(row.original.createdAt).toLocaleDateString('hu-HU', {
            minute: 'numeric',
            hour: 'numeric',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      );
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
            <Button
              variant='ghost'
              className='m-0 p-0'
              onClick={() => {
                setOpen(true);
              }}
            >
              <ColoredBadge status={row.original.status as ApplicationStatus} />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Command>
              <CommandInput placeholder='Keresés...' />
              <CommandList>
                <CommandEmpty>Nincs ilyen státusz</CommandEmpty>
                <CommandGroup>
                  {Object.keys(ApplicationStatus).map((status) => (
                    <CommandItem
                      key={status}
                      value={status}
                      onSelect={(value) => {
                        onStatusChange(row.original, value as ApplicationStatus);
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
