export class SimpleApplicationPeriodDto {
  id: number;
  name: string;
  applicationPeriodStartAt: Date;
  applicationPeriodEndAt: Date;
  createdAt: Date;
  updatedAt: Date;
  ticketsAreValid: boolean;
  authorId: string;
}
