import { Column } from '@tanstack/react-table';
import React, { useState } from 'react';
import { MdOutlineFilterAlt, MdOutlineFilterAltOff, MdSortByAlpha } from 'react-icons/md';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ApplicationEntity } from '@/types/application-entity';

export function DateSortableFilterableHeader(column: Column<ApplicationEntity>) {
  // @ts-expect-error
  const [start, setStart] = useState(column.getFilterValue()?.start || '2024-01-01T00:00');

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
