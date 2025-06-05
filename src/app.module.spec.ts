// src/app.module.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { AreaSumValidator } from './common/validators/area-sum.validator';

describe('AppModule (Unit)', () => {
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('deve estar definido', () => {
    expect(moduleRef).toBeDefined();
  });

  it('deve instanciar AppService sem erros', () => {
    // Atenção: usar AppService (classe) como token, não string
    const appService = moduleRef.get<AppService>(AppService);
    expect(appService).toBeDefined();
  });

  it('deve instanciar AreaSumValidator sem erros', () => {
    // Atenção: usar AreaSumValidator (classe) como token, não string
    const validator = moduleRef.get<AreaSumValidator>(AreaSumValidator);
    expect(validator).toBeDefined();
  });
});
