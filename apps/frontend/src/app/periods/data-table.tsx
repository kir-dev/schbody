'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import React from 'react';

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
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ApplicationStatus } from '@/types/application-entity';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div>
      <div className='flex items-center justify-between py-4 gap-4'>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Kijelölés</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Összes kijelölése</MenubarItem>
              <MenubarItem>Kiválogatottak kijelölése</MenubarItem>
              <MenubarItem>Kijelölés megszüntetése</MenubarItem>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger>Kijelöltek státuszának megváltoztatása</MenubarSubTrigger>
                <MenubarSubContent>
                  {(Object.keys(ApplicationStatus) as Array<keyof typeof ApplicationStatus>).map((key) => {
                    return <MenubarItem key={key}>{key}</MenubarItem>;
                  })}
                </MenubarSubContent>
              </MenubarSub>
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
              <MenubarItem>Kijelöltek exportálása</MenubarItem>
              <MenubarItem>Minden exportálása</MenubarItem>
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
        <Input
          placeholder='Keresés név alapján'
          value={(table.getColumn('Név')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('Név')?.setFilterValue(event.target.value)}
          className='max-w-sm'
        />
      </div>
      <div className='rounded-md border'>
        <Table className='w-full'>
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
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
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
                <div className='flex gap-8 justify-center'>
                  <span>
                    {table.getFilteredRowModel().rows.length} / {data.length} jelentkezés kiválogatva
                  </span>
                  <span>
                    {table.getFilteredSelectedRowModel().rows.length} / {table.getFilteredRowModel().rows.length}{' '}
                    jelentkezés kijelölve
                  </span>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
