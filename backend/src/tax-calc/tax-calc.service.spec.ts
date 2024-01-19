import { Test, TestingModule } from '@nestjs/testing';
import { TaxCalcService } from './tax-calc.service';
import { SalaryDto } from './dto/salary.dto';
import { DeductionsDto } from './dto/deductions.dto';

function expectedTaxableAmtFunc(salaryDto: SalaryDto) {
  const expectedCtc =
    salaryDto.basic +
    salaryDto.hra +
    salaryDto.spAllowance +
    salaryDto.otherTaxable;
  const expectedTaxableAmt = expectedCtc - 50000;
  return expectedTaxableAmt;
}

describe('TaxCalcService', () => {
  let service: TaxCalcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxCalcService],
    }).compile();

    service = module.get<TaxCalcService>(TaxCalcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  ///////////////----------ACCEPT CTC-------------/////////////////////
  //test case :  when salary is above 15 lakhs
  it('should update taxableAmt property after applying standard deduction', () => {
    const salaryDto = {
      basic: 960000,
      hra: 480000,
      spAllowance: 600000,
      otherTaxable: 240000,
    };

    service.acceptCtc(salaryDto);
    const expectedTaxableAmt = expectedTaxableAmtFunc(salaryDto);
    expect(service.taxableAmt).toBe(expectedTaxableAmt);
  });

  //test case :  when salary is 720000
  it('should update taxableAmt property after applying standard deduction', () => {
    const salaryDto: SalaryDto = {
      basic: 240000,
      hra: 120000,
      spAllowance: 240000,
      otherTaxable: 120000,
    };

    service.acceptCtc(salaryDto);
    const expectedTaxableAmt = expectedTaxableAmtFunc(salaryDto);

    expect(service.taxableAmt).toBe(expectedTaxableAmt);
  });

  //test case :  when salary is 960000
  it('should update taxableAmt property after applying standard deduction', () => {
    const salaryDto: SalaryDto = {
      basic: 480000,
      hra: 240000,
      spAllowance: 120000,
      otherTaxable: 120000,
    };

    service.acceptCtc(salaryDto);
    const expectedTaxableAmt = expectedTaxableAmtFunc(salaryDto);

    expect(service.taxableAmt).toBe(expectedTaxableAmt);
  });

  //////////////---------------NEW REGIME------------///////////////
  //test case :  when salary is above 15 lakhs
  it('should return the new regime tax applicable on the entered amount', () => {
    service.acceptCtc({
      basic: 960000,
      hra: 480000,
      spAllowance: 600000,
      otherTaxable: 240000,
    });
    const newRegimeResult = service.newRegimeTax();
    expect(newRegimeResult).toBe(383760);
  });

  //test case :  when salary is 720000
  it('should return the new regime tax applicable on the entered amount', () => {
    service.acceptCtc({
      basic: 240000,
      hra: 120000,
      spAllowance: 240000,
      otherTaxable: 120000,
    });
    const newRegimeResult = service.newRegimeTax();
    expect(newRegimeResult).toBe(0);
  });

  //test case :  when salary is 960000
  it('should return the new regime tax applicable on the entered amount', () => {
    service.acceptCtc({
      basic: 480000,
      hra: 240000,
      spAllowance: 120000,
      otherTaxable: 120000,
    });
    const newRegimeResult = service.newRegimeTax();
    expect(newRegimeResult).toBe(48360);
  });

  //////////////////------------DEDUCTIONS------------//////////////////////
  //test case :  when salary is above 15 lakhs

  //test case :  when salary is 720000
  it('should return the new taxable amount after applying the deductions', () => {
    const deductionDto: DeductionsDto = {
      mediclaim: 75000,
      houseLoan: 100000,
    };
    service.acceptCtc({
      basic: 240000,
      hra: 120000,
      spAllowance: 240000,
      otherTaxable: 120000,
    });
    const deductionResult = service.deductions(deductionDto);
    expect(deductionResult).toBe(495000);
  });

  //test case :  when salary is 960000
  it('should return the new taxable amount after applying the deductions', () => {
    const deductionDto: DeductionsDto = {
      mediclaim: 75000,
      educationLoan: 200000,
    };
    service.acceptCtc({
      basic: 480000,
      hra: 240000,
      spAllowance: 120000,
      otherTaxable: 120000,
    });
    const deductionResult = service.deductions(deductionDto);
    expect(deductionResult).toBe(635000);
  });

  //////////////////-------- OLD REGIME----------/////////////////////////
  //test case :  when salary is above 15 lakhs
  it('should return the new regime tax applicable on the entered amount', () => {
    const deductionDto: DeductionsDto = {
      mediclaim: 75000,
      section80c: 115200,
    };
    service.acceptCtc({
      basic: 960000,
      hra: 480000,
      spAllowance: 600000,
      otherTaxable: 240000,
    });
    const oldRegimeResult = service.oldRegimeTax(deductionDto);
    expect(oldRegimeResult).toBe(441417.6);
  });

  //test case :  when salary is 720000
  it('should return the new regime tax applicable on the entered amount', () => {
    const deductionDto: DeductionsDto = {
      mediclaim: 75000,
      houseLoan: 150000,
      section80c: 28800,
    };
    service.acceptCtc({
      basic: 240000,
      hra: 120000,
      spAllowance: 240000,
      otherTaxable: 120000,
    });
    const oldRegimeResult = service.oldRegimeTax(deductionDto);
    expect(oldRegimeResult).toBe(0);
  });

  //test case :  when salary is 960000
  it('should return the new regime tax applicable on the entered amount', () => {
    const deductionDto: DeductionsDto = {
      mediclaim: 75000,
      section80c: 57600,
    };
    service.acceptCtc({
      basic: 480000,
      hra: 240000,
      spAllowance: 120000,
      otherTaxable: 120000,
    });
    const oldRegimeResult = service.oldRegimeTax(deductionDto);
    expect(oldRegimeResult).toBe(70699.2);
  });

  /////////////////--------MAIN RESULTING OUTPUT--------///////////////////
  //test case :  when salary is above 15 lakhs
  it('based on the above calculations, it should display the regime with min value', () => {
    service.acceptCtc({
      basic: 960000,
      hra: 480000,
      spAllowance: 600000,
      otherTaxable: 240000,
    });
    const deductionDto: DeductionsDto = {
      mediclaim: 75000,
      section80c: 115200,
    };

    service.newRegimeTax();
    service.oldRegimeTax(deductionDto);

    expect(service.bestTaxRegime()).toEqual(
      'New Tax Regime should be considered for your overall income',
    );
  });

  //test case :  when salary is 720000
  it('based on the above calculations, it should display the regime with min value', () => {
    const deductionDto: DeductionsDto = {
      mediclaim: 75000,
      houseLoan: 150000,
      section80c: 28800,
    };
    service.acceptCtc({
      basic: 240000,
      hra: 120000,
      spAllowance: 240000,
      otherTaxable: 120000,
    });

    service.newRegimeTax();
    service.oldRegimeTax(deductionDto);

    expect(service.bestTaxRegime()).toEqual(
      'New Tax Regime should be considered for your overall income',
    );
  });

  //test case :  when salary is above 15 lakhs
  it('should provide an object showing newRegime, oldRegime and the bestRegime', () => {
    const salaryDto: SalaryDto = {
      basic: 960000,
      hra: 480000,
      spAllowance: 600000,
      otherTaxable: 240000,
    };

    const deductionDto: DeductionsDto = {
      mediclaim: 75000,
      section80c: 115200,
    };
    const result = service.showTaxCalculationResult(salaryDto, deductionDto);
    expect(result).toEqual({
      acceptCtc: undefined,
      newRegimeTax: 383760,
      oldRegimeTax: 441417.6,
      bestTaxRegime:
        'New Tax Regime should be considered for your overall income',
    });
  });

  //test case :  when salary is 720000
  it('should provide an object showing newRegime, oldRegime and the bestRegime', () => {
    const deductionDto: DeductionsDto = {
      mediclaim: 75000,
      houseLoan: 150000,
      section80c: 28800,
    };
    const salaryDto: SalaryDto = {
      basic: 240000,
      hra: 120000,
      spAllowance: 240000,
      otherTaxable: 120000,
    };
    const result = service.showTaxCalculationResult(salaryDto, deductionDto);
    expect(result).toEqual({
      acceptCtc: undefined,
      newRegimeTax: 0,
      oldRegimeTax: 0,
      bestTaxRegime:
        'New Tax Regime should be considered for your overall income',
    });
  });

  //test case :  when salary is 960000
  it('should provide an object showing newRegime, oldRegime and the bestRegime', () => {
    const deductionDto: DeductionsDto = {
      mediclaim: 75000,
      section80c: 57600,
    };
    const salaryDto = {
      basic: 480000,
      hra: 240000,
      spAllowance: 120000,
      otherTaxable: 120000,
    };
    const result = service.showTaxCalculationResult(salaryDto, deductionDto);
    expect(result).toEqual({
      acceptCtc: undefined,
      newRegimeTax: 48360,
      oldRegimeTax: 70699.2,
      bestTaxRegime:
        'New Tax Regime should be considered for your overall income',
    });
  });
});
