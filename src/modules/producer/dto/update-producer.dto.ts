import { IsOptional, IsString } from 'class-validator';

export class UpdateProducerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  cpfCnpj?: string;
}
