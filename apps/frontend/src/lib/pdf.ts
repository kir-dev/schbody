'use client';

import { ApplicationEntity, ApplicationStatus } from '@/types/application-entity';
import { Role } from '@/types/user-entity';
import { DocumentProps, pdf } from '@react-pdf/renderer';
import { ReactElement } from 'react';

export const mockApplication: ApplicationEntity = {
  id: 1,
  applicationPeriodId: 1,
  createdAt: new Date(),
  status: ApplicationStatus.ACCEPTED,
  updatedAt: new Date(),
  userId: 'abc',
  user: {
    authSchId: 'abcd',
    fullName: 'Példa Béla',
    roomNumber: 1319,
    canHelpNoobs: false,
    createdAt: '',
    email: 'a@d.c',
    id: 2,
    isActiveVikStudent: true,
    isSchResident: true,
    neptun: 'XXXXXX',
    nickName: 'Bélus',
    profileSeenAt: '',
    publicDesc: '',
    role: Role.USER,
    updatedAt: '',
    idNumber: '123456AB',
  },
};
export const downloadPdf = async (pdfComponent: ReactElement<DocumentProps>, fileName: string) => {
  const blob = await pdf(pdfComponent).toBlob();
  const a = document.createElement('a');
  a.style.display = 'none';
  document.body.appendChild(a);

  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};
