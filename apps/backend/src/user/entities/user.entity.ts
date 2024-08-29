import { Application, ApplicationPeriod, Post } from '@prisma/client';

export class User {
  authSchId: string;
  role: string;
  fullName: string;
  email: string;
  isSchResident: boolean;
  isActiveVikStudent: boolean;
  roomNumber: number;
  profileImage: any;
  canHelpNoobs: boolean;
  publicDesc: string;
  createdAt: Date;
  updatedAt: Date;
  profileSeenAt: Date;
  applicationPeriods: ApplicationPeriod[];
  applications: Application[];
  posts: Post[];
}

