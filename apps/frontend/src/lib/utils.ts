import { pdf, DocumentProps } from '@react-pdf/renderer';
import { type ClassValue, clsx } from 'clsx';
import { decode, JwtPayload } from 'jsonwebtoken';
import { ReactElement } from 'react';
import { twMerge } from 'tailwind-merge';

import { ApplicationEntity, ApplicationStatus } from '@/types/application-entity';
import { Role } from '@/types/user-entity';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRoleFromJwt = (jwtToken?: string): string => {
  if (!jwtToken) {
    return 'UNAUTHORIZED';
  }
  try {
    const dataFromjwt = decode(jwtToken);

    if (typeof dataFromjwt === 'string') {
      return 'UNAUTHORIZED';
    }
    const payload: JwtPayload = dataFromjwt as JwtPayload;
    if ((payload.exp || 0) < new Date().getTime() / 1000) {
      return 'UNAUTHORIZED';
    }
    return dataFromjwt?.role || 'UNAUTHORIZED';
  } catch (e) {
    return 'UNAUTHORIZED';
  }
};

export function getStatusKey(status: ApplicationStatus): string | undefined {
  const statusEntries = Object.entries(ApplicationStatus) as [string, ApplicationStatus][];
  for (const [key, value] of statusEntries) {
    if (value === status) {
      return key;
    }
  }
  return undefined;
}

export function getStatusName(status: ApplicationStatus): string {
  const statusEntries = Object.entries(ApplicationStatus) as [string, ApplicationStatus][];
  for (const [key, value] of statusEntries) {
    if (key === status) {
      return value;
    }
  }
  return 'Ismeretlen státusz';
}

export function statusConvert(status: ApplicationStatus): keyof typeof ApplicationStatus {
  return status as unknown as keyof typeof ApplicationStatus;
}

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
