import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CropController } from './crop.controller';
import { CropService } from './crop.service';
import { Crop } from './entities/crop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Crop])],
  providers: [CropService],
  controllers: [CropController],
})
export class CropModule {}
