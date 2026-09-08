'use client';
import { Column, ColumnDef, FilterFn } from '@tanstack/react-table';

import StatusBadge from '@/components/ui/StatusBadge';
import { DateSortableFilterableHeader } from '@/components/ui/table-headers/DateSortableFilterableHeader';
import { SortableFilterableHeader } from '@/components/ui/table-headers/SortableFilterableHeader';
import { filterByDateRange } from '@/lib/customFilters';
import { ApplicationEntity, ApplicationStatus } from '@/types/application-entity';
import { ApplicationStatusLogEntity } from '@/types/application-status-log-entity';

// The shared table headers are typed against ApplicationEntity, but only use the
// generic Column API – reuse them here with a cast.
const textHeader = (column: Column<ApplicationStatusLogEntity>) =>
  SortableFilterableHeader(column as unknown as Column<ApplicationEntity>);
const dateHeader = (column: Column<ApplicationStatusLogEntity>) =>
  DateSortableFilterableHeader(column as unknown as Column<ApplicationEntity>);

function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
  });
}

export const columns: ColumnDef<ApplicationStatusLogEntity>[] = [
  {
    id: 'Jelentkezés',
    accessorFn: (row) => `#${row.application?.id ?? row.applicationId}`,
    size: 90,
    enableResizing: false,
    header: ({ column }) => textHeader(column),
    cell: ({ row }) => <span className='font-mono'>#{row.original.application?.id ?? row.original.applicationId}</span>,
  },
  {
    id: 'Jelentkező',
    accessorFn: (row) => row.application?.user.fullName ?? '—',
    header: ({ column }) => textHeader(column),
    cell: ({ row }) => <span>{row.original.application?.user.fullName ?? '—'}</span>,
  },
  {
    id: 'Módosította',
    accessorFn: (row) => row.changedBy?.fullName ?? 'Rendszer',
    header: ({ column }) => textHeader(column),
    cell: ({ row }) => (
      <span className={row.original.changedBy ? '' : 'italic text-gray-500'}>
        {row.original.changedBy?.fullName ?? 'Rendszer'}
      </span>
    ),
  },
  {
    id: 'Régi állapot',
    accessorFn: (row) => row.previousStatus ?? '',
    size: 120,
    enableResizing: false,
    header: ({ column }) => textHeader(column),
    cell: ({ row }) =>
      row.original.previousStatus ? (
        <StatusBadge status={row.original.previousStatus as unknown as ApplicationStatus} />
      ) : (
        <span className='text-gray-500'>—</span>
      ),
  },
  {
    id: 'Új állapot',
    accessorKey: 'newStatus',
    size: 120,
    enableResizing: false,
    header: ({ column }) => textHeader(column),
    cell: ({ row }) => <StatusBadge status={row.original.newStatus as unknown as ApplicationStatus} />,
  },
  {
    id: 'Időpont',
    accessorKey: 'createdAt',
    size: 160,
    enableResizing: false,
    filterFn: filterByDateRange as unknown as FilterFn<ApplicationStatusLogEntity>,
    header: ({ column }) => dateHeader(column),
    cell: ({ row }) => <span>{formatDate(row.original.createdAt)}</span>,
  },
];
