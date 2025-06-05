import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'AreaSumValidator', async: false })
export class AreaSumValidator implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as any;
    const agricultural = obj.agriculturalArea as number;
    const vegetation = obj.vegetationArea as number;
    const total = obj.totalArea as number;
    return agricultural + vegetation <= total;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Soma de área agricultável e vegetação ultrapassa a área total.';
  }
}
