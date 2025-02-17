export enum Role {
  BODY_ADMIN = 'BODY_ADMIN',
  BODY_MEMBER = 'BODY_MEMBER',
  USER = 'USER',
  SUPERUSER = 'SUPERUSER',
}

export enum ProfilePictureStatus {
  ACCEPTED = 'Jóváhagyott profilkép',
  PENDING = 'Elbírálás alatt álló profilkép',
  REJECTED = 'Elutasított profilkép',
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
  isActiveVikStudent: boolean;
  publicDesc: string | null;
  createdAt: string;
  updatedAt: string;
  profileSeenAt: string | null;
  idNumber: string | null;
  profilePicture?: {
    status: ProfilePictureStatus;
  };
};

export type UserEntityPagination = {
  users: UserEntity[];
  totalUsers: number;
  pageNumber: number;
};
export type MemberEntity = {
  authSchId: string;
  fullName: string;
  nickName: string;
  email: string;
  canHelpNoobs: boolean;
  role: Role;
  createdAt: Date;
  publicDesc?: string;
};
