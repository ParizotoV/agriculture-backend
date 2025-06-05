import { Module } from '@nestjs/common';
import { CropModule } from './crop/crop.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { FarmModule } from './farm/farm.module';
import { ProducerModule } from './producer/producer.module';

@Module({
  imports: [CropModule, FarmModule, ProducerModule, DashboardModule],
  controllers: [],
  providers: [],
})
export class IndexModule {}
