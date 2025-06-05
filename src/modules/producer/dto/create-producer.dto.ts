import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProducerDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  cpfCnpj!: string;
}
