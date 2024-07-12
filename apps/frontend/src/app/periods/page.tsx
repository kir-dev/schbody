import React from 'react';

import { mockApplications } from '@/app/mockdata/mock-data';
import { columns } from '@/app/periods/columns';
import { DataTable } from '@/app/periods/data-table';

export default function Page() {
  const applications = mockApplications;

  return (
    <>
      <h1 className='m-8 text-2xl font-bold'>Jelentkezési időszak kezelése</h1>
      <div className='m-8'>
        {/*         <Table className='w-full'>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox />
              </TableHead>
              <TableHead colSpan={2}>User</TableHead>
              <TableHead>Státusz</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id} className='h-0 p-0'>
                <TableCell className='font-medium py-2'>
                  <Checkbox />
                </TableCell>
                <TableCell className='w-0 py-2'>
                  <Avatar>
                    <AvatarImage src='' alt={app.user.nickName.at(0)} />
                    <AvatarFallback>{app.user.nickName.at(0)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className='py-2'>{app.user.fullName}</TableCell>
                <TableCell className='py-2'>
                  <Badge>{app.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Összesen</TableCell>
              <TableCell className='text-right'>{applications.length} jelentkezes</TableCell>
            </TableRow>
          </TableFooter>
        </Table>*/}
        <DataTable columns={columns} data={applications} />
      </div>
    </>
  );
}
