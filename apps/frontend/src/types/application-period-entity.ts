export type ApplicationPeriodEntity = {
  id: number;
  name: string;
  applicationPeriodStartAt: Date;
  applicationPeriodEndAt: Date;
  ticketsAreValid: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
};
