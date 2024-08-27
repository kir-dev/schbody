export type ApplicationPeriodEntity = {
  id: number;
  name: string;
  applicationPeriodStartAt: Date;
  applicationPeriodEndAt: Date;
  ticketsAreValid: boolean;
  author: {
    fullName: string;
    nickName: string;
  };
  createdAt: Date;
  updatedAt: Date;
};
