import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { Crop } from './entities/crop.entity';
@Injectable()
export class CropService {
  constructor(
    @InjectRepository(Crop)
    private readonly cropRepository: Repository<Crop>,
  ) {}

  async create(createCropDto: CreateCropDto) {
    const existingCrop = await this.cropRepository.findOne({
      where: {
        farmId: createCropDto.farmId,
        season: createCropDto.season,
        cultureName: createCropDto.cultureName,
      },
    });

    if (existingCrop) {
      throw new BadRequestException('Crop already exists');
    }

    const crop = this.cropRepository.create(createCropDto);
    return this.cropRepository.save(crop);
  }

  async findAll() {
    return this.cropRepository.find({
      relations: ['farm'],
    });
  }

  async findOne(id: string) {
    const crop = await this.cropRepository.findOne({
      where: { id },
      relations: ['farm'],
    });

    if (!crop) {
      throw new NotFoundException('Crop not found');
    }

    return crop;
  }

  async update(id: string, updateCropDto: UpdateCropDto) {
    const crop = await this.findOne(id);

    if (!crop) {
      throw new NotFoundException('Crop not found');
    }

    Object.assign(crop, updateCropDto);
    return this.cropRepository.save(crop);
  }

  async remove(id: string) {
    return this.cropRepository.delete(id);
  }
}
