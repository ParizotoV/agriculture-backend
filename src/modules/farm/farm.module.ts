import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaSumValidator } from '../../common/validators/area-sum.validator';
import { Farm } from './entities/farm.entity';
import { FarmController } from './farm.controller';
import { FarmService } from './farm.service';

@Module({
  imports: [TypeOrmModule.forFeature([Farm])],
  providers: [AreaSumValidator, FarmService],
  controllers: [FarmController],
})
export class FarmModule {}
