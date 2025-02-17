import { ApplicationStatus } from '@/types/application-entity';
import { ProfilePictureStatus } from '@/types/user-entity';

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

export function applicationStatusConvert(status: ApplicationStatus): keyof typeof ApplicationStatus {
  return status as unknown as keyof typeof ApplicationStatus;
}

export function pfpStatusConvert(status: ProfilePictureStatus): keyof typeof ProfilePictureStatus {
  return status as unknown as keyof typeof ProfilePictureStatus;
}
