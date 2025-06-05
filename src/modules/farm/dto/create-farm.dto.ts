import { IsNotEmpty, IsNumber, IsString, Min, Validate } from 'class-validator';

import { AreaSumValidator } from '../../../common/validators/area-sum.validator';

export class CreateFarmDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  city!: string;

  @IsNotEmpty()
  @IsString()
  state!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalArea!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  agriculturalArea!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  vegetationArea!: number;

  @IsNotEmpty()
  @IsString()
  producerId!: string;

  @Validate(AreaSumValidator, ['agriculturalArea', 'vegetationArea', 'totalArea'], {
    message: 'A soma de área agricultável e vegetação não pode ultrapassar a área total.',
  })
  dummy?: any;
}
