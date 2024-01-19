import { Injectable } from '@nestjs/common';
import { newRegimeTaxSlabs } from './constants/new-regime';
import { oldRegimeTaxSlabs } from './constants/old-regime';
import { DeductionsDto } from './dto/deductions.dto';
import { SalaryDto } from './dto/salary.dto';

@Injectable()
export class TaxCalcService {
  taxableAmt: number;
  private basic: number;
  private newTaxPayable: number;
  private oldTaxPayable: number;

  showTaxCalculationResult(
    salaryDto: SalaryDto,
    deductionsDto: DeductionsDto,
  ): {
    acceptCtc: void;
    newRegimeTax: number;
    oldRegimeTax: number;
    bestTaxRegime: string;
  } {
    const acceptCtc = this.acceptCtc(salaryDto);
    const newRegimeTax = this.newRegimeTax();
    const oldRegimeTax = this.oldRegimeTax(deductionsDto);
    const bestTaxRegime = this.bestTaxRegime();
    return { acceptCtc, newRegimeTax, oldRegimeTax, bestTaxRegime };
  }

  acceptCtc(salaryDto: SalaryDto): void {
    const { basic, hra, spAllowance, otherTaxable } = salaryDto;
    console.log('this is salaryDto in service:', salaryDto);
    const ctc: number = +basic + +hra + +spAllowance + +otherTaxable;
    console.log(ctc);
    this.taxableAmt = ctc - 50000;
    this.basic = +basic;
  }

  newRegimeTax(): number {
    const findTaxableIndex = (amount: number): number =>
      newRegimeTaxSlabs.findIndex(
        (slab) => amount > slab.llimit && amount <= slab.ulimit,
      );

    const index = findTaxableIndex(this.taxableAmt);

    console.log(
      'this is taxableAmt in service for newRegime :',
      this.taxableAmt,
    );
    const calculateTax = (
      addition: number,
      rate: number,
      amount: number,
    ): number => {
      if (newRegimeTaxSlabs[index].llimit === 750001) {
        return (amount - 600000) * rate + addition;
      } else {
        return (amount - newRegimeTaxSlabs[index].llimit) * rate + addition;
      }
    };

    const taxPayable =
      index !== -1
        ? calculateTax(
            newRegimeTaxSlabs[index].addition,
            newRegimeTaxSlabs[index].rate,
            this.taxableAmt,
          )
        : 0;
    this.newTaxPayable = taxPayable + taxPayable * 0.04;
    this.newTaxPayable = parseFloat(this.newTaxPayable.toFixed(2));
    return this.newTaxPayable;
  }

  deductions(deductionsDto: DeductionsDto): number {
    const { mediclaim, houseLoan, educationLoan, section80c } = deductionsDto;
    console.log('this is deductions dto in service :', deductionsDto);
    let deductionTaxableAmt = this.taxableAmt;
    console.log(
      'this is taxableAmt in deductions in service : ',
      this.taxableAmt,
    );

    if (mediclaim !== undefined) {
      deductionTaxableAmt -= Math.min(mediclaim, 75000);
    }

    console.log('this is mediclaim in deductions :', mediclaim);
    console.log(
      'this is taxableAmt in deductions after mediclaim in service : ',
      deductionTaxableAmt,
    );

    if (houseLoan !== undefined) {
      deductionTaxableAmt -= Math.min(houseLoan, 200000);
    }

    if (educationLoan !== undefined) {
      deductionTaxableAmt -= educationLoan;
    }

    if (section80c !== undefined) {
      deductionTaxableAmt -= Math.min(section80c, 150000);
    }

    console.log('this is section80c in deductions :', section80c);
    console.log(
      'this is taxableAmt in deductions after section80c in service : ',
      deductionTaxableAmt,
    );

    return deductionTaxableAmt;
  }

  oldRegimeTax(deductionsDto: DeductionsDto): number {
    const afterDedAmt = this.deductions(deductionsDto);
    console.log('this is afterDedAmt in service for oldRegime :', afterDedAmt);
    const findTaxableIndex = (amount: number): number =>
      oldRegimeTaxSlabs.findIndex(
        (slab) => amount > slab.llimit && amount <= slab.ulimit,
      );
    const index = findTaxableIndex(afterDedAmt);
    console.log(index);
    const calculateTax = (
      addition: number,
      rate: number,
      amount: number,
    ): number => (amount - oldRegimeTaxSlabs[index].llimit) * rate + addition;

    const taxPayable =
      index !== -1
        ? calculateTax(
            oldRegimeTaxSlabs[index].addition,
            oldRegimeTaxSlabs[index].rate,
            afterDedAmt,
          )
        : 0;

    this.oldTaxPayable = taxPayable + taxPayable * 0.04;
    this.oldTaxPayable = parseFloat(this.oldTaxPayable.toFixed(2));

    return this.oldTaxPayable;
  }

  bestTaxRegime(): string {
    if (this.newTaxPayable <= this.oldTaxPayable) {
      return 'New Tax Regime should be considered for your overall income';
    } else {
      return 'old Tax Regime should be considered for your overall income';
    }
  }
}
