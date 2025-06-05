// src/common/validators/area-sum.validator.spec.ts
import { ValidationArguments } from 'class-validator';
import { AreaSumValidator } from './area-sum.validator';

describe('AreaSumValidator', () => {
  let validator: AreaSumValidator;

  beforeEach(() => {
    validator = new AreaSumValidator();
  });

  it('deve retornar true quando agriculturalArea + vegetationArea <= totalArea', () => {
    const args: ValidationArguments = {
      value: null,
      constraints: [],
      targetName: 'Farm',
      property: 'dummy',
      object: {
        agriculturalArea: 50,
        vegetationArea: 30,
        totalArea: 100,
      },
    };
    expect(validator.validate(null, args)).toBe(true);
  });

  it('deve retornar false quando agriculturalArea + vegetationArea > totalArea', () => {
    const args: ValidationArguments = {
      value: null,
      constraints: [],
      targetName: 'Farm',
      property: 'dummy',
      object: {
        agriculturalArea: 60,
        vegetationArea: 50,
        totalArea: 100,
      },
    };
    expect(validator.validate(null, args)).toBe(false);
  });

  it('defaultMessage deve retornar a mensagem correta em português', () => {
    const args: ValidationArguments = {
      value: null,
      constraints: [],
      targetName: 'Farm',
      property: 'dummy',
      object: {},
    };
    expect(validator.defaultMessage(args)).toBe(
      'Soma de área agricultável e vegetação ultrapassa a área total.',
    );
  });
});
