import { Test, TestingModule } from '@nestjs/testing';
import { TaxCalcController } from './tax-calc.controller';
import { TaxCalcService } from './tax-calc.service';
import { TaxCalcModule } from './tax-calc.module';
import { SalaryDto } from './dto/salary.dto';
import { DeductionsDto } from './dto/deductions.dto';

describe('TaxCalcController', () => {
  let controller: TaxCalcController;
  let service: TaxCalcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxCalcController],
      providers: [TaxCalcService],
      imports: [TaxCalcModule],
    }).compile();

    controller = module.get<TaxCalcController>(TaxCalcController);
    service = module.get<TaxCalcService>(TaxCalcService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('showTaxCalculationResult', () => {
    //test case :  when salary is above 15 lakhs
    it('should give detailed object displaying newRegime, oldRegime and bestRegime', () => {
      const salaryDto: SalaryDto = {
        basic: 960000,
        hra: 480000,
        spAllowance: 600000,
        otherTaxable: 240000,
      };

      const deductionsDto: DeductionsDto = {
        mediclaim: 75000,
        section80c: 115200,
      };
      jest.spyOn(service, 'showTaxCalculationResult').mockReturnValue({
        acceptCtc: undefined,
        newRegimeTax: 383760,
        oldRegimeTax: 441417.6,
        bestTaxRegime:
          'New Tax Regime should be considered for your overall income',
      });

      const result = controller.showTaxCalculationResult(
        JSON.stringify(salaryDto),
        JSON.stringify(deductionsDto),
      );

      expect(service.showTaxCalculationResult).toHaveBeenCalledWith(
        salaryDto,
        deductionsDto,
      );

      expect(result).toEqual({
        acceptCtc: undefined,
        newRegimeTax: 383760,
        oldRegimeTax: 441417.6,
        bestTaxRegime:
          'New Tax Regime should be considered for your overall income',
      });
    });

    ////////////////////////////////////////////////////////////////////////
    //test case :  when salary is above 720000
    it('should give detailed object displaying newRegime, oldRegime and bestRegime', () => {
      const deductionsDto: DeductionsDto = {
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
      jest.spyOn(service, 'showTaxCalculationResult').mockReturnValue({
        acceptCtc: undefined,
        newRegimeTax: 0,
        oldRegimeTax: 0,
        bestTaxRegime:
          'New Tax Regime should be considered for your overall income',
      });
      const result = controller.showTaxCalculationResult(
        JSON.stringify(salaryDto),
        JSON.stringify(deductionsDto),
      );

      expect(service.showTaxCalculationResult).toHaveBeenCalledWith(
        salaryDto,
        deductionsDto,
      );

      expect(result).toEqual({
        acceptCtc: undefined,
        newRegimeTax: 0,
        oldRegimeTax: 0,
        bestTaxRegime:
          'New Tax Regime should be considered for your overall income',
      });
    });

    ////////////////////////////////////////////////////////////////////////
    //test case :  when salary is above 960000
    it('should give detailed object displaying newRegime, oldRegime and bestRegime', () => {
      const deductionsDto: DeductionsDto = {
        mediclaim: 75000,
        section80c: 57600,
      };
      const salaryDto = {
        basic: 480000,
        hra: 240000,
        spAllowance: 120000,
        otherTaxable: 120000,
      };
      jest.spyOn(service, 'showTaxCalculationResult').mockReturnValue({
        acceptCtc: undefined,
        newRegimeTax: 48360,
        oldRegimeTax: 70699.2,
        bestTaxRegime:
          'New Tax Regime should be considered for your overall income',
      });

      const result = controller.showTaxCalculationResult(
        JSON.stringify(salaryDto),
        JSON.stringify(deductionsDto),
      );

      expect(service.showTaxCalculationResult).toHaveBeenCalledWith(
        salaryDto,
        deductionsDto,
      );

      expect(result).toEqual({
        acceptCtc: undefined,
        newRegimeTax: 48360,
        oldRegimeTax: 70699.2,
        bestTaxRegime:
          'New Tax Regime should be considered for your overall income',
      });
    });
  });
});
