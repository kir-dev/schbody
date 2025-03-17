'use client';

import { utils, write } from 'xlsx';

/**
 * Generates an XLSX file from the provided data and returns it as a Blob.
 *
 * @param data - An array of objects representing the data to be included in the XLSX file.
 * @param fileName - The name of the file (without extension) to be used for the worksheet.
 * @returns A Blob representing the generated XLSX file.
 */
export function generateXlsx(data: any[], fileName: string): Blob {
  console.log('Data being exported to and excel file: ');
  console.table(data);
  const worksheet = utils.json_to_sheet(data);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, fileName);

  const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/octet-stream' });
}
