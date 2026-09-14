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
  MenubarMenu,
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
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'Időpont', desc: true }]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 30 });

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility, pagination },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
  });

  return (
    <div>
      <div className='flex items-center justify-between py-4 gap-4 sticky top-0 z-20 backdrop-blur'>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Nézet</MenubarTrigger>
            <MenubarContent>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <MenubarCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={(value: boolean) => column.toggleVisibility(Boolean(value))}
                  >
                    {column.id}
                  </MenubarCheckboxItem>
                ))}
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            disabled={columnFilters.length === 0}
            onClick={() => setColumnFilters([])}
          >
            Szűrők törlése
          </Button>
          <Input
            placeholder='Keresés jelentkező alapján'
            value={(table.getColumn('Jelentkező')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('Jelentkező')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
        </div>
      </div>
      <div className='rounded-md border'>
        <Table className='w-full bg-white rounded z-0'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    <h4 className='text-black'>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </h4>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                    {table.getFilteredRowModel().rows.length} / {data.length} naplóbejegyzés
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
