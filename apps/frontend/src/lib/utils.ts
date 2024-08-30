import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { ApplicationStatus } from '@/types/application-entity';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStatusKey(status: ApplicationStatus): string | undefined {
  console.log(status.toString());
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
