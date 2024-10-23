'use client';
import { ColumnDef } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { FiArrowRightCircle, FiCheck, FiCopy } from 'react-icons/fi';
import { RiVerifiedBadgeLine } from 'react-icons/ri';

import api from '@/components/network/apiSetup';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import RoleBadge, { getRoleBadgeColor } from '@/components/ui/RoleBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import { DateSortableFilterableHeader } from '@/components/ui/table-headers/DateSortableFilterableHeader';
import { SortableFilterableHeader } from '@/components/ui/table-headers/SortableFilterableHeader';
import { filterByDateRange } from '@/lib/customFilters';
import { toast } from '@/lib/use-toast';
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
    header: ({ column }) => {
      return SortableFilterableHeader(column);
    },
    cell: ({ row }) => {
      return (
        <div className='flex items-center'>
          <span className='block w-24 text-ellipsis overflow-clip font-mono'>{row.original.user.email}</span>
          <FiCopy
            onClick={() => {
              navigator.clipboard.writeText(row.original.user.email as string);
              toast({
                title: 'Másolva',
                description: 'Az email cím vágólapra másolva',
              });
            }}
          />
        </div>
      );
    },
  },
  {
    id: 'Szoba',
    accessorKey: 'user.roomNumber',
    header: ({ column }) => {
      return SortableFilterableHeader(column);
    },
    cell: ({ row }) => {
      if (row.original.user.isSchResident) {
        return <span className='font-bold font-mono'>{row.original.user.roomNumber}</span>;
      }
      return <span>Külsős</span>;
    },
  },
  {
    id: 'Igazolványszám',
    accessorKey: 'user.idNumber',
    header: ({ column }) => {
      return SortableFilterableHeader(column);
    },
    cell: ({ row }) => {
      const [idNumber, setIdNumber] = useState(row.original.user.idNumber);
      return (
        <form
          className='flex gap-2 h-auto'
          onSubmit={async (event) => {
            event.preventDefault();
            try {
              const resp = await api.patch(`/users/${row.original.user.authSchId}`, { idNumber: idNumber });
              if (resp.status === 200) {
                toast({
                  title: 'Sikeres mentés',
                  description: 'Az igazolványszám sikeresen mentve',
                });
              }
            } catch (e) {
              if (e instanceof AxiosError) {
                toast({
                  title: 'Hiba történt',
                  description: e.message,
                });
              }
            }
          }}
        >
          <Input
            placeholder='123456AB'
            onChange={(e) => {
              setIdNumber(e.target.value);
            }}
            value={idNumber ? idNumber : ''}
            className='w-24 py-1 h-auto'
          />
          <Button type='submit' className='h-fit w-fit px-2' variant='secondary'>
            <FiCheck />
          </Button>
        </form>
      );
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
    id: 'Frissítve',
    accessorKey: 'updatedAt',
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
              onClick={() => onStatusChange(row.original, ApplicationStatus.VALID)}
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
