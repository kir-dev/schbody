import { type ClassValue, clsx } from 'clsx';
import { decode, JwtPayload } from 'jsonwebtoken';
import { twMerge } from 'tailwind-merge';

import { ApplicationStatus } from '@/types/application-entity';

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
