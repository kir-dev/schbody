export class CreateApplicationPeriodDto {
  name: string;
  applicationPeriodStartAt: Date;
  applicationPeriodEndAt: Date;
  ticketsAreValid: boolean;
}
