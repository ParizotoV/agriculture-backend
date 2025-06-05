import { IsNotEmpty, IsString } from 'class-validator';

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
}
