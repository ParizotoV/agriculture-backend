import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AreaSumValidator } from './common/validators/area-sum.validator';
import { typeOrmConfig } from './config/typeorm.config';
import { IndexModule } from './modules/index.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), IndexModule],
  controllers: [AppController],
  providers: [
    AppService,
    AreaSumValidator,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
