import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, type SelectQueryBuilder } from 'typeorm';
import { Crop } from '../crop/entities/crop.entity';
import { Farm } from '../farm/entities/farm.entity';
import { ByCultureDto } from './dto/by-culture.dto';
import { ByLandUseDto } from './dto/by-land-use.dto';
import { ByStateDto } from './dto/by-state.dto';
import { SummaryDto } from './dto/summary.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
    @InjectRepository(Crop)
    private readonly cropRepository: Repository<Crop>,
  ) {}

  async getSummary(): Promise<SummaryDto> {
    const totalFarms = await this.farmRepository.count();

    const raw = await this.farmRepository
      .createQueryBuilder('farm')
      .select('SUM(farm.total_area)', 'sum')
      .getRawOne<{ sum: string }>();

    const totalHectaresRaw = raw?.sum ?? '0';
    const totalHectares = parseFloat(totalHectaresRaw) || 0;

    return { totalFarms, totalHectares };
  }

  async getByState(): Promise<ByStateDto[]> {
    const raw = await this.farmRepository
      .createQueryBuilder('farm')
      .select('farm.state', 'state')
      .addSelect('COUNT(farm.id)', 'farmCount')
      .groupBy('farm.state')
      .getRawMany<{ state: string; farmCount: string }>();

    return raw.map(({ state, farmCount }) => ({
      state,
      farmCount: parseInt(farmCount, 10),
    }));
  }

  async getByCulture(): Promise<ByCultureDto[]> {
    const raw = await this.cropRepository
      .createQueryBuilder('crop')
      .select('crop.culture_name', 'cultureName')
      .addSelect('COUNT(crop.id)', 'count')
      .addSelect('SUM(crop.harvestQuantity)', 'totalHarvest')
      .addSelect('SUM(crop.priceReceived)', 'totalRevenue')
      .groupBy('crop.culture_name')
      .getRawMany<{
        cultureName: string;
        count: string;
        totalHarvest: string;
        totalRevenue: string;
      }>();

    return raw.map((r) => ({
      cultureName: r.cultureName,
      count: parseInt(r.count, 10),
      totalHarvest: parseFloat(r.totalHarvest) || 0,
      totalRevenue: parseFloat(r.totalRevenue) || 0,
    }));
  }

  async getByLandUse(): Promise<ByLandUseDto> {
    const qb: SelectQueryBuilder<Farm> = this.farmRepository.createQueryBuilder('farm');

    const raw = await qb
      .select('SUM(farm.agricultural_area)', 'agriculturalSum')
      .addSelect('SUM(farm.vegetation_area)', 'vegetationSum')
      .getRawOne<{ agriculturalSum: string; vegetationSum: string }>();

    const agriculturalArea = parseFloat(raw?.agriculturalSum || '0') || 0;
    const vegetationArea = parseFloat(raw?.vegetationSum || '0') || 0;

    return { agriculturalArea, vegetationArea };
  }
}
