import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { Farm } from './entities/farm.entity';

@Injectable()
export class FarmService {
  constructor(
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
  ) {}

  async create(createFarmDto: CreateFarmDto) {
    const farm = this.farmRepository.create(createFarmDto);
    return this.farmRepository.save(farm);
  }

  async findAll() {
    return this.farmRepository.find({
      relations: ['producer', 'crops'],
    });
  }

  async findOne(id: string) {
    const farm = await this.farmRepository.findOne({ where: { id } });

    if (!farm) {
      throw new NotFoundException('Farm not found');
    }

    return farm;
  }

  async update(id: string, updateFarmDto: UpdateFarmDto) {
    const farm = await this.findOne(id);

    if (!farm) {
      throw new NotFoundException('Farm not found');
    }

    Object.assign(farm, updateFarmDto);
    return this.farmRepository.save(farm);
  }

  async remove(id: string) {
    const result = await this.farmRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Farm not found');
    }

    return { message: 'Farm deleted successfully' };
  }
}
