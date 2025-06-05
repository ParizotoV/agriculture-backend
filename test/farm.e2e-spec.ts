import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';

import { FarmModule } from '../src/modules/farm/farm.module';
import { ProducerModule } from '../src/modules/producer/producer.module';

import { Crop } from '../src/modules/crop/entities/crop.entity';
import { Farm } from '../src/modules/farm/entities/farm.entity';
import { Producer } from '../src/modules/producer/entities/producer.entity';

describe('FarmController (E2E)', () => {
  let app: INestApplication;
  let producerId: string;

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
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    // Cria um produtor para usar em todas as rotas de farm
    const createProducerRes = await request(app.getHttpServer())
      .post('/producers')
      .send({ name: 'Produtor Teste', cpfCnpj: '11070208914' })
      .expect(201);
    producerId = createProducerRes.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/farms (POST) → deve criar uma fazenda válida', async () => {
    const dto = {
      name: 'Fazenda Teste',
      city: 'Cidade Exemplo',
      state: 'Estado Exemplo',
      totalArea: 100,
      agriculturalArea: 50,
      vegetationArea: 30,
      producerId: producerId,
    };

    return request(app.getHttpServer())
      .post('/farms')
      .send(dto)
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe(dto.name);
        expect(res.body.producerId).toBe(producerId);
      });
  });

  it('/farms (POST) → fazenda inválida retorna 400', () => {
    // Omitir algum campo obrigatório (ex.: producerId)
    const dto = {
      name: 'Fazenda Sem Produtor',
      city: 'Cidade',
      state: 'Estado',
      totalArea: 100,
      agriculturalArea: 50,
      vegetationArea: 30,
      // producerId ausente → deve falhar
    };

    return request(app.getHttpServer()).post('/farms').send(dto).expect(400);
  });

  it('/farms/:id (GET) → retorna 404 se não existir', () => {
    return request(app.getHttpServer()).get('/farms/nao-existe-id').expect(404);
  });

  it('/farms/:id (GET) → retorna fazenda existente', async () => {
    // Cria fazenda para buscar em seguida
    const createRes = await request(app.getHttpServer())
      .post('/farms')
      .send({
        name: 'Busca Fazenda',
        city: 'Cidade',
        state: 'Estado',
        totalArea: 200,
        agriculturalArea: 80,
        vegetationArea: 50,
        producerId: producerId,
      })
      .expect(201);
    const id = createRes.body.id;

    return request(app.getHttpServer())
      .get(`/farms/${id}`)
      .expect(200)
      .then((res) => {
        expect(res.body.id).toBe(id);
        expect(res.body.name).toBe('Busca Fazenda');
        expect(res.body.producerId).toBe(producerId);
      });
  });

  it('/farms/:id (PUT) → atualiza fazenda e retorna 200', async () => {
    // Primeiro cria uma fazenda
    const createRes = await request(app.getHttpServer())
      .post('/farms')
      .send({
        name: 'Atualiza Fazenda',
        city: 'Cidade',
        state: 'Estado',
        totalArea: 300,
        agriculturalArea: 100,
        vegetationArea: 80,
        producerId: producerId,
      })
      .expect(201);
    const id = createRes.body.id;

    // Atualiza, por exemplo, o nome
    await request(app.getHttpServer())
      .put(`/farms/${id}`)
      .send({
        name: 'Fazenda Atualizada',
        city: 'Cidade',
        state: 'Estado',
        totalArea: 300,
        agriculturalArea: 100,
        vegetationArea: 80,
        producerId: producerId,
      })
      .expect(200);

    const res = await request(app.getHttpServer()).get(`/farms/${id}`).expect(200);

    expect(res.body.name).toBe('Fazenda Atualizada');
  });

  it('/farms/:id (DELETE) → remove fazenda e retorna 200', async () => {
    // Cria outra fazenda
    const createRes = await request(app.getHttpServer())
      .post('/farms')
      .send({
        name: 'Fazenda Deletar',
        city: 'Cidade',
        state: 'Estado',
        totalArea: 150,
        agriculturalArea: 60,
        vegetationArea: 40,
        producerId: producerId,
      })
      .expect(201);
    const id = createRes.body.id;

    // Deleta
    await request(app.getHttpServer()).delete(`/farms/${id}`).expect(200);

    // GET depois deve retornar 404
    await request(app.getHttpServer()).get(`/farms/${id}`).expect(404);
  });
});
