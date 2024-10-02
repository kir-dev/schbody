'use client';
import { ColumnDef } from '@tanstack/react-table';
import React, { useState } from 'react';
import { FiArrowRightCircle } from 'react-icons/fi';
import { RiVerifiedBadgeLine } from 'react-icons/ri';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import RoleBadge, { getRoleBadgeColor } from '@/components/ui/RoleBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import { DateSortableFilterableHeader } from '@/components/ui/table-headers/DateSortableFilterableHeader';
import { SortableFilterableHeader } from '@/components/ui/table-headers/SortableFilterableHeader';
import { filterByDateRange } from '@/lib/customFilters';
import { ApplicationEntity, ApplicationStatus } from '@/types/application-entity';

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
          <HoverCardTrigger>
            <div className='flex gap-2 items-center'>
              <div className={`${getRoleBadgeColor(row.original.user.role, true)} h-6 w-1 rounded`} />
              <p className=''>{row.original.user.fullName}</p>
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
    cell: ({ row }) => {
      return <span className='font-mono'>{row.original.user.email}</span>;
    },
  },
  {
    id: 'Szoba',
    accessorKey: 'user.roomNumber',
    header: ({ column }) => {
      return SortableFilterableHeader(column);
    },
  },
  {
    id: 'Szerep',
    accessorKey: 'user.role',
    header: ({ column }) => {
      return SortableFilterableHeader(column);
    },
    cell: ({ row }) => {
      return <RoleBadge role={row.original.user.role} short />;
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
    size: 100,
    enableResizing: false,
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
