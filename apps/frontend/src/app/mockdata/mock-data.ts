import { ApplicationEntity, ApplicationStatus } from '@/types/application-entity';
import { ApplicationPeriodEntity } from '@/types/application-period-entity';
import { Role, UserEntity } from '@/types/user-entity';

export const mockUser: UserEntity = {
  fullName: 'Minta Pista',
  neptun: 'NEPTUN',
  nickName: 'Bujdi Bohoc',
  email: 'email@kir-dev.hu',
  canHelpNoobs: false,
  role: Role.USER,
  isSchResident: true,
  roomNumber: 1211,
  id: 1,
  authSchId: '1',
  createdAt: '1970-01-01T00:00:00.000Z',
  updatedAt: '1970-01-01T00:00:00.000Z',
  profileSeenAt: '1970-01-01T00:00:00.000Z',
  publicDesc: null,
};

export const mockUsers: UserEntity[] = [
  {
    id: 1,
    authSchId: 'asd',
    fullName: 'Kiss József',
    nickName: 'Józsi',
    neptun: 'ASDASD',
    email: 'valami@kir.dev',
    role: Role.BODY_ADMIN,
    isSchResident: true,
    roomNumber: 1319,
    canHelpNoobs: true,
    publicDesc: 'semmi',
    createdAt: '1970-01-01T00:00:00.000Z',
    updatedAt: '1970-01-01T00:00:00.000Z',
    profileSeenAt: '1970-01-01T00:00:00.000Z',
  },
  {
    id: 1,
    authSchId: 'wer',
    fullName: 'Marosi Karcsi',
    nickName: 'Karcsi',
    neptun: 'WERWER',
    email: 'mas@kir.dev',
    role: Role.USER,
    isSchResident: true,
    roomNumber: 420,
    canHelpNoobs: false,
    publicDesc: '',
    createdAt: '1970-01-01T00:00:00.000Z',
    updatedAt: '1970-01-01T00:00:00.000Z',
    profileSeenAt: '1970-01-01T00:00:00.000Z',
  },
];

export const mockApplicationPeriods: ApplicationPeriodEntity[] = [
  {
    id: 1,
    name: '2021/22/1',
    applicationPeriodStartAt: new Date(2021, 8, 1),
    applicationPeriodEndAt: new Date(2021, 8, 15),
    ticketsAreValid: false,
    createdAt: new Date(313123122),
    updatedAt: new Date(313123122),
    author: mockUsers[0],
  },
];
export const mockApplications: ApplicationEntity[] = [
  {
    id: 1,
    user: mockUsers[1],
    period: mockApplicationPeriods[0],
    status: ApplicationStatus.SUBMITTED,
    createdAt: new Date(313123122),
    updatedAt: new Date(313123122),
  },
  {
    id: 2,
    user: mockUsers[0],
    period: mockApplicationPeriods[0],
    status: ApplicationStatus.ACCEPTED,
    createdAt: new Date(313123122),
    updatedAt: new Date(313123122),
  },
];
