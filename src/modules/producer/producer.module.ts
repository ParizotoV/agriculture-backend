import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producer } from './entities/producer.entity';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Producer])],
  providers: [ProducerService],
  controllers: [ProducerController],
})
export class ProducerModule {}
