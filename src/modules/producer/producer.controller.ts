import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CpfCnpjValidationPipe } from '../../common/pipes/cpf-cnpj-validation.pipe';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { ProducerService } from './producer.service';

@Controller('producers')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post()
  create(
    @Body(new ValidationPipe({ whitelist: true }))
    createProducerDto: CreateProducerDto,
    @Body('cpfCnpj', new CpfCnpjValidationPipe())
    cpfCnpj: string,
  ) {
    return this.producerService.create({
      ...createProducerDto,
      cpfCnpj,
    });
  }

  @Get()
  findAll() {
    return this.producerService.findAll();
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  update(@Param('id') id: string, @Body() updateProducerDto: UpdateProducerDto) {
    return this.producerService.update(id, {
      ...updateProducerDto,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.producerService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.producerService.remove(id);
  }
}
