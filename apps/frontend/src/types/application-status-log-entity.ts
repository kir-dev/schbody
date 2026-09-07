import { ApplicationStatus } from '@/types/application-entity';

export type StatusLogUserRef = {
  authSchId: string;
  fullName: string;
  nickName: string;
};

/**
 * One entry of the application status-change audit log.
 * `previousStatus` / `newStatus` are the raw enum keys (e.g. `REJECTED`).
 * `changedBy` is `null` for system-initiated changes.
 */
export type ApplicationStatusLogEntity = {
  id: number;
  applicationId: number;
  changedById: string | null;
  changedBy: StatusLogUserRef | null;
  previousStatus: keyof typeof ApplicationStatus | null;
  newStatus: keyof typeof ApplicationStatus;
  createdAt: string;
  application: {
    id: number;
    applicationPeriodId: number;
    user: StatusLogUserRef;
  } | null;
};
