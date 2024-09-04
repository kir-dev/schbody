import { FilterFn } from '@tanstack/react-table';

import { ApplicationEntity2 } from '@/types/application-entity';

export const filterByDateRange: FilterFn<ApplicationEntity2> = (row, columnId, filterValue) => {
  if (!filterValue?.start && !filterValue?.end) return true;

  const rowDate = new Date(row.getValue(columnId) as string);
  const startDate = filterValue.start ? new Date(filterValue.start) : null;
  const endDate = filterValue.end ? new Date(filterValue.end) : null;

  if (startDate && endDate) {
    return rowDate >= startDate && rowDate <= endDate;
  } else if (startDate) {
    return rowDate >= startDate;
  } else if (endDate) {
    return rowDate <= endDate;
  }

  return true;
};
