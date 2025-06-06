import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCropDto {
  @IsNotEmpty()
  @IsString()
  season!: string;

  @IsNotEmpty()
  @IsString()
  cultureName!: string;

  @IsNotEmpty()
  @IsString()
  farmId!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  harvestQuantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceReceived?: number;
}
