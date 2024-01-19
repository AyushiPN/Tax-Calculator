import { Module } from '@nestjs/common';

import { TaxCalcModule } from './tax-calc/tax-calc.module';

@Module({
  imports: [TaxCalcModule],
})
export class AppModule {}
