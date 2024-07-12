import { ApplicationEntity, ApplicationStatus } from '@/types/application-entity';
import { ApplicationPeriodEntity } from '@/types/application-period-entity';
import { Role, UserEntity } from '@/types/user-entity';

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
    createdAt: new Date(634534),
    updatedAt: new Date(313123122),
    profileSeenAt: new Date(313123122),
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
    createdAt: new Date(342),
    updatedAt: new Date(5345),
    profileSeenAt: new Date(313123122),
  },
];

export const mockApplicationPeriods: ApplicationPeriodEntity[] = [
  {
    id: 1,
    name: '2021/22/1',
    applicationStart: new Date(2021, 8, 1),
    applicationEnd: new Date(2021, 8, 15),
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