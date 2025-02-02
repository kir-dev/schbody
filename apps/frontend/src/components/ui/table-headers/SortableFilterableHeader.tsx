import { Column } from '@tanstack/react-table';
import React from 'react';
import { MdOutlineFilterAlt, MdOutlineFilterAltOff, MdSortByAlpha } from 'react-icons/md';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ApplicationEntity } from '@/types/application-entity';

export function SortableFilterableHeader(column: Column<ApplicationEntity>) {
  return (
    <div className='flex items-center justify-start gap-0'>
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
              className='underline text-sm cursor-pointer'
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
