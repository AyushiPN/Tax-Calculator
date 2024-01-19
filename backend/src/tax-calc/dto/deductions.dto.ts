import { IsNumber, IsOptional, Max } from 'class-validator';

export class DeductionsDto {
  @IsOptional()
  @IsNumber()
  @Max(75000, { message: 'Mediclaim should be less than or equal to 75000' })
  mediclaim?: number;

  @IsOptional()
  @IsNumber()
  @Max(200000, { message: 'House loan should be less than or equal to 200000' })
  houseLoan?: number;

  @IsOptional()
  @IsNumber()
  educationLoan?: number;

  @IsOptional()
  @IsNumber()
  @Max(150000, {
    message: 'Section 80C should be less than or equal to 150000',
  })
  section80c?: number;
}

// export class DeductionsDto {
//   @IsOptional()
//   @IsNumber()
//   @Max(75000, { message: 'Mediclaim should be less than or equal to 75000' })
//   mediclaim?: number;

//   @IsOptional()
//   @IsNumber()
//   hraRebate?: number;

//   @IsOptional()
//   @IsNumber()
//   @Max(200000, { message: 'House loan should be less than or equal to 200000' })
//   houseLoan?: number;

//   @IsOptional()
//   @IsNumber()
//   educationLoan?: number;

//   @IsOptional()
//   @IsNumber()
//   @Max(150000, {
//     message: 'Section 80C should be less than or equal to 150000',
//   })
//   section80c?: number;
// }
