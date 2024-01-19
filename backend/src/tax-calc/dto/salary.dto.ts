import { IsNumber } from 'class-validator';

export class SalaryDto {
  @IsNumber()
  basic: number;
  @IsNumber()
  hra: number;
  @IsNumber()
  spAllowance: number;
  @IsNumber()
  otherTaxable: number;
}
