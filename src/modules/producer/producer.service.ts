import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { Producer } from './entities/producer.entity';

@Injectable()
export class ProducerService {
  constructor(
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
  ) {}

  async create(createProducerDto: CreateProducerDto) {
    const existingProducer = await this.producerRepository.findOne({
      where: { cpfCnpj: createProducerDto.cpfCnpj },
    });

    if (existingProducer) {
      throw new BadRequestException('Producer with this CPF/CNPJ already exists');
    }

    const producer = this.producerRepository.create(createProducerDto);
    return this.producerRepository.save(producer);
  }

  async findAll() {
    return this.producerRepository.find({
      relations: ['farms', 'farms.crops'],
    });
  }

  async findOne(id: string) {
    const producer = await this.producerRepository.findOne({
      where: { id },
      relations: ['farms', 'farms.crops'],
    });

    if (!producer) {
      throw new NotFoundException('Producer not found');
    }

    return producer;
  }

  async update(id: string, updateProducerDto: UpdateProducerDto) {
    const producer = await this.findOne(id);

    if (!producer) {
      throw new NotFoundException('Producer not found');
    }

    Object.assign(producer, updateProducerDto);
    return this.producerRepository.save(producer);
  }

  async remove(id: string) {
    const result = await this.producerRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Producer not found');
    }

    return { message: 'Producer deleted successfully' };
  }
}
