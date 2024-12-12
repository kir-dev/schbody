import { ApplicationStatus } from '@/types/application-entity';

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
