'use client';
import { Column, ColumnDef } from '@tanstack/react-table';
import React, { useState } from 'react';
import { MdOutlineFilterAlt, MdOutlineFilterAltOff, MdSortByAlpha } from 'react-icons/md';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import StatusBadge from '@/components/ui/StatusBadge';
import { ApplicationEntity2, ApplicationStatus } from '@/types/application-entity';

function SortableFilterableHeader(column: Column<ApplicationEntity2>, title: string) {
  return (
    <div className=' flex h-4 items-center gap-1 justify-start'>
      {title}
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        <MdSortByAlpha size={20} />
      </Button>
      <Popover>
        <PopoverTrigger>
          {column.getFilterValue() === undefined ? (
            <MdOutlineFilterAlt size={20} />
          ) : (
            <MdOutlineFilterAltOff size={20} />
          )}
        </PopoverTrigger>
        <PopoverContent className='p-3'>
          <p className='mb-2 font-bold'>Szöveges szűrés</p>
          <Input
            value={column.getFilterValue()?.toString()}
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder={`Szűrés ${title} alapján`}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function DateSortableFilterableHeader(column: Column<ApplicationEntity2>) {
  const [start, setStart] = useState(column.getFilterValue()?.toString() || '');
  const [end, setEnd] = useState(column.getFilterValue()?.toString() || '');

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStart(e.target.value);
    column.setFilterValue(e.target.value);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnd(e.target.value);
    column.setFilterValue(e.target.value);
  };

  return (
    <Popover>
      <PopoverTrigger>
        {column.getFilterValue() === undefined ? <MdOutlineFilterAlt size={20} /> : <MdOutlineFilterAltOff size={20} />}
      </PopoverTrigger>
      <PopoverContent>
        <p className='mb-2 font-bold'>Dátum szűrés</p>
        <div className='flex gap-2'>
          <Input
            type='date'
            value={start}
            onChange={handleStartChange}
            className='date-input'
            placeholder='Szűrés dátum alapján'
          />
          <Input
            type='date'
            value={end}
            onChange={handleEndChange}
            className='date-input'
            placeholder='Szűrés dátum alapján'
          />
        </div>
      </PopoverContent>
    </Popover>
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
      return SortableFilterableHeader(column, 'Név');
    },
  },
  {
    id: 'Neptun',
    accessorKey: 'user.neptun',
    header: ({ column }) => {
      return SortableFilterableHeader(column, 'Neptun');
    },
  },
  {
    id: 'Kontakt',
    accessorKey: 'user.email',
    header: ({ column }) => {
      return SortableFilterableHeader(column, 'Kontakt');
    },
  },
  {
    id: 'Leadva',
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return DateSortableFilterableHeader(column);
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
      return SortableFilterableHeader(column, 'Státusz');
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
              <StatusBadge status={row.original.status as ApplicationStatus} />
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
                      <StatusBadge status={status as ApplicationStatus} />
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
