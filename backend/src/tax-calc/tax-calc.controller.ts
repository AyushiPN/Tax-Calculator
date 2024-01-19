import { Controller, Get, Headers } from '@nestjs/common';
import { TaxCalcService } from './tax-calc.service';
import { DeductionsDto } from './dto/deductions.dto';
import { SalaryDto } from './dto/salary.dto';

@Controller('tax-calc')
export class TaxCalcController {
  constructor(private taxCalcService: TaxCalcService) {}

  @Get()
  showTaxCalculationResult(
    @Headers('ctc-header') ctcHeader: string,
    @Headers('deductions-header') deductionsHeader: string,
  ): {
    acceptCtc: void;
    newRegimeTax: number;
    oldRegimeTax: number;
    bestTaxRegime: string;
  } {
    const salaryDto: SalaryDto = JSON.parse(ctcHeader);
    const deductionsDto: DeductionsDto = JSON.parse(deductionsHeader);

    return this.taxCalcService.showTaxCalculationResult(
      salaryDto,
      deductionsDto,
    );
  }
}
