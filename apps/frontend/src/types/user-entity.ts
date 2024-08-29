export enum Role {
  BODY_ADMIN = 'BODY_ADMIN',
  BODY_MEMBER = 'BODY_MEMBER',
  USER = 'USER',
}

export type UserEntity = {
  id: number;
  authSchId: string;
  fullName: string;
  nickName: string;
  neptun: string;
  email: string | null;
  role: Role;
  isSchResident: boolean;
  roomNumber: number | null;
  canHelpNoobs: boolean;
  publicDesc: string | null;
  createdAt: string;
  updatedAt: string;
  profileSeenAt: string | null;
};
