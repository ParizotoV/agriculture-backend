import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';

import { CropModule } from '../src/modules/crop/crop.module';
import { DashboardModule } from '../src/modules/dashboard/dashboard.module';
import { FarmModule } from '../src/modules/farm/farm.module';
import { ProducerModule } from '../src/modules/producer/producer.module';

import { Crop } from '../src/modules/crop/entities/crop.entity';
import { Farm } from '../src/modules/farm/entities/farm.entity';
import { Producer } from '../src/modules/producer/entities/producer.entity';

describe('CropController (E2E)', () => {
  let app: INestApplication;
  let farmId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Producer, Farm, Crop],
          synchronize: true,
          dropSchema: true,
        }),
        ProducerModule,
        FarmModule,
        CropModule,
        DashboardModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    const producerRes = await request(app.getHttpServer())
      .post('/producers')
      .send({
        name: 'Produtor Teste',
        cpfCnpj: '11070208914',
      })
      .expect(201);
    const producerId = producerRes.body.id;

    const farmRes = await request(app.getHttpServer())
      .post('/farms')
      .send({
        name: 'Fazenda Teste',
        city: 'Cidade Teste',
        state: 'Estado Teste',
        totalArea: 100,
        agriculturalArea: 50,
        vegetationArea: 30,
        producerId: producerId,
      })
      .expect(201);

    farmId = farmRes.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/crops (POST) → deve criar uma colheita válida', async () => {
    const dto = {
      season: '2024',
      cultureName: 'Soja',
      farmId: farmId,
    };

    return request(app.getHttpServer())
      .post('/crops')
      .send(dto)
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.season).toBe(dto.season);
        expect(res.body.cultureName).toBe(dto.cultureName);
        expect(res.body.farmId).toBe(farmId);
      });
  });

  it('/crops (POST) → colheita inválida retorna 400', () => {
    const dto = {
      season: '2024',
      cultureName: 'Invalido',
      // farmId: '999',  // comentado de propósito para causar 400
    };

    return request(app.getHttpServer()).post('/crops').send(dto).expect(400);
  });

  it('/crops/:id (GET) → retorna 404 se não existir', () => {
    return request(app.getHttpServer()).get('/crops/nonexistent-id').expect(404);
  });

  it('/crops/:id (GET) → retorna colheita existente', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/crops')
      .send({
        season: '2020',
        cultureName: 'Soja',
        farmId: farmId,
      })
      .expect(201);
    const id = createRes.body.id;

    return request(app.getHttpServer())
      .get(`/crops/${id}`)
      .expect(200)
      .then((res) => {
        expect(res.body.id).toBe(id);
        expect(res.body.season).toBe('2020');
        expect(res.body.cultureName).toBe('Soja');
        expect(res.body.farmId).toBe(farmId);
      });
  });

  it('/crops/:id (PUT) → atualiza dados e retorna 200', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/crops')
      .send({
        season: '2023',
        cultureName: 'Soja',
        farmId: farmId,
      })
      .expect(201);
    const id = createRes.body.id;

    await request(app.getHttpServer())
      .put(`/crops/${id}`)
      .send({ season: '2025', cultureName: 'Soja', farmId: farmId })
      .expect(200);

    const res = await request(app.getHttpServer()).get(`/crops/${id}`).expect(200);

    expect(res.body.season).toBe('2025');
    expect(res.body.cultureName).toBe('Soja');
    expect(res.body.farmId).toBe(farmId);
  });

  it('/crops/:id (DELETE) → remove colheita e retorna 200', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/crops')
      .send({
        season: '2022',
        cultureName: 'Soja',
        farmId: farmId,
      })
      .expect(201);
    const id = createRes.body.id;

    await request(app.getHttpServer()).delete(`/crops/${id}`).expect(200);

    await request(app.getHttpServer()).get(`/crops/${id}`).expect(404);
  });
});
