import { Module } from '@nestjs/common';
import { TaxCalcController } from './tax-calc.controller';
import { TaxCalcService } from './tax-calc.service';

@Module({
  controllers: [TaxCalcController],
  providers: [TaxCalcService],
})
export class TaxCalcModule {}
