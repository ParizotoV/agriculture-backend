import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CropService } from './crop.service';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';

@Controller('crops')
export class CropController {
  constructor(private readonly cropService: CropService) {}

  @Post()
  create(@Body() createCropDto: CreateCropDto) {
    return this.cropService.create(createCropDto);
  }

  @Get()
  findAll() {
    return this.cropService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cropService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCropDto: UpdateCropDto) {
    return this.cropService.update(id, updateCropDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cropService.remove(id);
  }
}
