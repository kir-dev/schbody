/* eslint-disable max-lines */
'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar';
import {
  Pagination,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';
import StatusBadge from '@/components/ui/StatusBadge';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ApplicationEntity, ApplicationStatus } from '@/types/application-entity';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onStatusChange?: (row: TData, status: ApplicationStatus) => void;
  onExportPassesClicked: (data: TData[]) => void;
  onExportApplicationsClicked: (data: TData[]) => void;
  onSetToManufactured: (data: TData[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onStatusChange,
  onExportApplicationsClicked,
  onExportPassesClicked,
  onSetToManufactured,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: 'Név',
      desc: false,
    },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({ Szerep: false, Leadva: false });
  const [rowSelection, setRowSelection] = React.useState<Record<number, boolean>>({});
  const [automaticSelectionWhenRowClicked, setAutomaticSelectionWhenRowClicked] = React.useState(false);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 30,
  });
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
  });
  const invertSelection = () => {
    table.getExpandedRowModel().rows.map((row) => row.toggleSelected(!row.getIsSelected()));
  };

  function setSelectedToStatus(value: ApplicationStatus) {
    if (!onStatusChange) return;
    const selectedRows = table.getSelectedRowModel().rows;
    selectedRows.map((row) => onStatusChange(row.original, value));
  }

  function selectGivenStatuses(value: ApplicationStatus) {
    table.getExpandedRowModel().rows.map((row) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if ((row.original.status! as ApplicationStatus) === value) row.toggleSelected(true);
      else row.toggleSelected(false);
    });
  }

  return (
    <div>
      <div className='flex items-center justify-between py-4 gap-4 sticky top-0 z-20 backdrop-blur'>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Kijelölés</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={table.getToggleAllRowsSelectedHandler()}>Összes kijelölése</MenubarItem>
              <MenubarItem onClick={invertSelection}>Kijelölés invertálása</MenubarItem>
              <MenubarItem onClick={() => table.resetRowSelection(false)}>Kijelölés megszüntetése</MenubarItem>
              <MenubarItem onClick={() => table.resetRowSelection(false)}>Kijelölés megszüntetése</MenubarItem>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger>Adott státuszúak kijelölése</MenubarSubTrigger>
                <MenubarSubContent>
                  {Object.keys(ApplicationStatus).map((key) => {
                    return (
                      <MenubarItem key={key} onClick={() => selectGivenStatuses(key as ApplicationStatus)}>
                        <StatusBadge status={key as ApplicationStatus} /> -k kijelölése
                      </MenubarItem>
                    );
                  })}
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSub>
                <MenubarSubTrigger>Kijelöltek státuszának megváltoztatása</MenubarSubTrigger>
                <MenubarSubContent>
                  {Object.keys(ApplicationStatus).map((key) => {
                    return (
                      <MenubarItem key={key} onClick={() => setSelectedToStatus(key as ApplicationStatus)}>
                        <StatusBadge status={key as ApplicationStatus} />
                        -ra/re állítása
                      </MenubarItem>
                    );
                  })}
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSeparator />
              <MenubarCheckboxItem
                checked={automaticSelectionWhenRowClicked}
                onCheckedChange={(value: boolean) => setAutomaticSelectionWhenRowClicked(value)}
              >
                Kattintáskor instant kijelölés
              </MenubarCheckboxItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Szűrés</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Listás szűrés indítása</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Exportálás</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={() => onExportPassesClicked(data.filter((_, i) => rowSelection[i]))}>
                Kijelöltekhez belépők exportálása
              </MenubarItem>
              <MenubarItem onClick={() => onExportPassesClicked(data)}>Minden belépő exportálása</MenubarItem>
              <MenubarItem
                onClick={() =>
                  onExportPassesClicked(
                    data.filter(
                      (a) =>
                        (a as ApplicationEntity).user.role === 'BODY_ADMIN' ||
                        (a as ApplicationEntity).user.role === 'BODY_MEMBER'
                    )
                  )
                }
              >
                Körtagok belépőinek exportálása
              </MenubarItem>

              <Separator />
              <MenubarItem onClick={() => onExportApplicationsClicked(data.filter((_, i) => rowSelection[i]))}>
                Kijelöltekhez lista exportálása (csak kiosztott)
              </MenubarItem>
              <MenubarItem
                onClick={() =>
                  onExportApplicationsClicked(data.filter((a) => (a as ApplicationEntity).user.isSchResident))
                }
              >
                Kollégisták exportálása (csak kiosztott)
              </MenubarItem>
              <MenubarItem
                onClick={() =>
                  onExportApplicationsClicked(data.filter((a) => !(a as ApplicationEntity).user.isSchResident))
                }
              >
                Nem kollégisták exportálása (csak kiosztott)
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Nézet</MenubarTrigger>
            <MenubarContent>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <MenubarCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value: boolean) => column.toggleVisibility(Boolean(value))}
                    >
                      {column.id}
                    </MenubarCheckboxItem>
                  );
                })}
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <div className='flex gap-2'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => onSetToManufactured(data)} variant='outline'>
                  Nyomtatással kész
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <span className='flex gap-2 items-center'>
                  Az összes <StatusBadge status={'PREPARED_FOR_PRINT' as ApplicationStatus} hover={false} />
                  jelentkezés
                  <StatusBadge status={'MANUFACTURED' as ApplicationStatus} hover={false} />
                  -ra állítása
                </span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Input
            placeholder='Keresés név alapján'
            value={(table.getColumn('Név')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('Név')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
        </div>
      </div>
      <div className='rounded-md border'>
        <Table className='w-full bg-white rounded z-0'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      <h4 className='text-black'>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </h4>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => automaticSelectionWhenRowClicked && row.toggleSelected(!row.getIsSelected())}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  Nincs találat
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns.length}>
                <div className='flex gap-8 justify-center my-2'>
                  <span>
                    {table.getFilteredRowModel().rows.length} / {data.length} jelentkezés kiszűrve
                  </span>
                  <span>
                    {table.getFilteredSelectedRowModel().rows.length} / {table.getFilteredRowModel().rows.length}{' '}
                    jelentkezés kijelölve
                  </span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Pagination className='mb-2'>
                  <PaginationContent>
                    <div className={table.getCanPreviousPage() ? 'flex' : 'pointer-events-none opacity-50 flex'}>
                      <PaginationItem onClick={() => table.firstPage()}>
                        <PaginationFirst />
                      </PaginationItem>
                      <PaginationItem onClick={() => table.previousPage()}>
                        <PaginationPrevious />
                      </PaginationItem>
                    </div>
                    <PaginationItem>
                      <PaginationLink href='#' isActive>
                        {pagination.pageIndex + 1}
                      </PaginationLink>
                    </PaginationItem>
                    <div className={table.getCanNextPage() ? 'flex' : 'pointer-events-none opacity-50 flex'}>
                      <PaginationItem onClick={() => table.nextPage()}>
                        <PaginationNext />
                      </PaginationItem>
                      <PaginationItem onClick={() => table.lastPage()}>
                        <PaginationLast />
                      </PaginationItem>
                    </div>
                  </PaginationContent>
                </Pagination>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
