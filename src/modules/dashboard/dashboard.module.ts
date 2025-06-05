import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crop } from '../crop/entities/crop.entity';
import { Farm } from '../farm/entities/farm.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([Farm, Crop])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
