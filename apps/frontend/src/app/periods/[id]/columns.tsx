'use client';
import { Column, ColumnDef } from '@tanstack/react-table';
import React, { useState } from 'react';
import { FiArrowRightCircle } from 'react-icons/fi';
import { MdOutlineFilterAlt, MdOutlineFilterAltOff, MdSortByAlpha } from 'react-icons/md';
import { RiVerifiedBadgeLine } from 'react-icons/ri';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import StatusBadge from '@/components/ui/StatusBadge';
import { filterByDateRange } from '@/lib/customFilters';
import { ApplicationEntity, ApplicationStatus } from '@/types/application-entity';

function SortableFilterableHeader(column: Column<ApplicationEntity>) {
  return (
    <div className=' flex items-center justify-start'>
      {column.id}
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        <MdSortByAlpha size={16} />
      </Button>
      <Popover>
        <PopoverTrigger>
          {column.getFilterValue() === undefined ? (
            <MdOutlineFilterAlt size={16} />
          ) : (
            <MdOutlineFilterAltOff size={16} />
          )}
        </PopoverTrigger>
        <PopoverContent className='p-3'>
          <div className='flex w-full justify-between mb-2'>
            <p className='font-bold'>Szöveg szűrés</p>
            <p
              className='underline'
              onClick={() => {
                column.setFilterValue(undefined);
              }}
            >
              visszaállítás
            </p>
          </div>
          <Input
            value={column.getFilterValue() ? column.getFilterValue()!.toString() : ''}
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder={`Szűrés ${column.id.toLowerCase()} alapján`}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function DateSortableFilterableHeader(column: Column<ApplicationEntity>) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const [start, setStart] = useState(column.getFilterValue()?.start || '2024-01-01T00:00');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const [end, setEnd] = useState(column.getFilterValue()?.end || '2025-01-01T00:00');

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    setStart(newStart);
    column.setFilterValue((oldValue: { start: string; end: string }) => ({ ...oldValue, start: newStart }));
  };

  // Handler for end date change
  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value;
    setEnd(newEnd);
    column.setFilterValue((oldValue: { start: string; end: string }) => ({ ...oldValue, end: newEnd }));
  };
  return (
    <div className='flex h-4 items-center gap-1 justify-start'>
      {column.id}
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        <MdSortByAlpha size={16} />
      </Button>
      <Popover>
        <PopoverTrigger>
          {column.getFilterValue() === undefined ? (
            <MdOutlineFilterAlt size={16} />
          ) : (
            <MdOutlineFilterAltOff size={16} />
          )}
        </PopoverTrigger>
        <PopoverContent className='p-3'>
          <div className='flex w-full justify-between mb-2'>
            <p className='font-bold'>Dátum szűrés</p>
            <p
              className='underline'
              onClick={() => {
                column.setFilterValue(undefined);
                setStart('2024-01-01T00:00');
                setEnd('2025-01-01T00:00');
              }}
            >
              visszaállítás
            </p>
          </div>
          <div className='flex gap-2'>
            <div>
              <p className='mb-2'>Kezdő dátum</p>
              <Input
                type='datetime-local'
                value={start.toString()}
                onChange={handleStartChange}
                className='date-input'
                placeholder='Szűrés dátum alapján'
              />
            </div>
            <div>
              <p className='mb-2'>Vég dátum</p>
              <Input
                type='datetime-local'
                value={end.toString()}
                onChange={handleEndChange}
                className='date-input'
                placeholder='Szűrés dátum alapján'
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export const columns: (
  quickMode: boolean,
  onStatusChange: (row: ApplicationEntity, status: ApplicationStatus) => void
) => ColumnDef<ApplicationEntity>[] = (quickMode, onStatusChange) => [
  {
    id: 'Választ',
    enableResizing: false, // Disable resizing
    size: 50, // Fixed size for consistency
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onClick={table.getToggleAllRowsSelectedHandler()}
        aria-label='Minden kijelölése'
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
    enableResizing: false, // Disable resizing
    size: 150, // Fixed size for consistency
    header: ({ column }) => {
      return SortableFilterableHeader(column);
    },
    cell: ({ row }) => {
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className='flex gap-2 items-center'>
              {row.original.user.fullName}
              {row.original.user.isActiveVikStudent && <RiVerifiedBadgeLine size={16} />}
            </div>
          </HoverCardTrigger>
          <HoverCardContent>
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/users/${row.original.user.authSchId}/profile-picture`}
              alt='KEP'
              className='rounded max-w-32'
            />
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    id: 'Neptun',
    accessorKey: 'user.neptun',
    enableResizing: false, // Disable resizing
    size: 120, // Fixed size for consistency
    header: ({ column }) => {
      return SortableFilterableHeader(column);
    },
  },
  {
    id: 'Kontakt',
    accessorKey: 'user.email',
    enableResizing: false, // Disable resizing
    size: 180, // Fixed size for consistency
    header: ({ column }) => {
      return SortableFilterableHeader(column);
    },
  },
  {
    id: 'Leadva',
    accessorKey: 'createdAt',
    enableResizing: false, // Disable resizing
    size: 140, // Fixed size for consistency
    filterFn: filterByDateRange,
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
      return SortableFilterableHeader(column);
    },
    enableResizing: false,
    size: 100,
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      return (
        <div className='flex gap-2 items-center justify-between'>
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
                    {Object.entries(ApplicationStatus).map(([key, status]) => (
                      <CommandItem
                        key={key}
                        value={status}
                        onSelect={(value) => {
                          onStatusChange(row.original, value as ApplicationStatus);
                          setOpen(false);
                        }}
                      >
                        <StatusBadge status={key as ApplicationStatus} />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {quickMode && (row.original.status as ApplicationStatus) !== ('FINISHED' as ApplicationStatus) && (
            <Button
              variant='outline'
              className='h-min px-2 py-0.5 rounded'
              disabled={(row.original.status as ApplicationStatus) === ('REJECTED' as ApplicationStatus)}
              onClick={() => onStatusChange(row.original, ApplicationStatus.FINISHED)}
            >
              <FiArrowRightCircle />
              Kiosztás
            </Button>
          )}
        </div>
      );
    },
  },
];
