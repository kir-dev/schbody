'use client';
import { ColumnDef } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { useState } from 'react';
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
import Image from 'next/image';
import { LuCheck, LuCircleArrowRight, LuCopy } from 'react-icons/lu';
import PfpStatusBadge from '@/components/ui/PfpStatusBadge';
import WarningBadge from '@/components/ui/WarningBadge';

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
            <div className='flex gap-2 items-center justify-between'>
              <div className='flex gap-2 items-center'>
                <div className={`${getRoleBadgeColor(row.original.user.role, true)} h-6 w-1 rounded`} />
                <p>{row.original.user.fullName} </p>
              </div>
              {row.original.user.isActiveVikStudent && (
                <span className='text-sm'>
                  <RiVerifiedBadgeLine size={16} />
                </span>
              )}
            </div>
          </HoverCardTrigger>
          <HoverCardContent>
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/users/${row.original.user.authSchId}/profile-picture`}
              alt='KEP'
              className='rounded max-w-32'
              width={128}
              height={128}
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
    cell: ({ row }) => {
      if (row.original.user.neptun) return row.original.user.neptun;
      return <WarningBadge />;
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
          <span className='block w-24 text-ellipsis overflow-clip'>{row.original.user.email}</span>
          <LuCopy
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
        return <span>{row.original.user.roomNumber}</span>;
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
      // eslint-disable-next-line react-hooks/rules-of-hooks
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
            onChange={(e) => {
              setIdNumber(e.target.value);
            }}
            value={idNumber ? idNumber : ''}
            className='w-24 py-1 h-auto'
          />
          {(idNumber || row.original.user.idNumber) && (
            <Button type='submit' className='h-fit w-fit px-2' variant='secondary'>
              <LuCheck />
            </Button>
          )}
          {!(idNumber || row.original.user.idNumber) && <WarningBadge />}
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
    id: 'Profilkép',
    accessorKey: 'user.profilePicture.status',
    header: ({ column }) => {
      return SortableFilterableHeader(column);
    },
    cell: ({ row }) => {
      if (row.original.user.profilePicture) return <PfpStatusBadge status={row.original.user.profilePicture?.status} />;
      return <WarningBadge />;
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
    id: 'Modosítva',
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
      // eslint-disable-next-line react-hooks/rules-of-hooks
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
            <PopoverContent className='w-fit'>
              <Command>
                <CommandInput placeholder='Keresés...' />
                <CommandList>
                  <CommandEmpty>Nincs ilyen státusz</CommandEmpty>
                  <CommandGroup className='w-96 mt-4 flex flex-wrap justify-center content-center'>
                    {Object.entries(ApplicationStatus).map(([key, status]) => (
                      <CommandItem
                        key={key}
                        value={status}
                        className='inline-block w-fit p-0 m-0.5'
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
          {quickMode && row.original.status !== ApplicationStatus.DISTRIBUTED && (
            <Button
              variant='outline'
              className='h-min px-2 py-0.5 rounded'
              disabled={(row.original.status as ApplicationStatus) === ('REJECTED' as ApplicationStatus)}
              onClick={() => onStatusChange(row.original, ApplicationStatus.DISTRIBUTED)}
            >
              <LuCircleArrowRight />
              Kiosztás
            </Button>
          )}
        </div>
      );
    },
  },
];
