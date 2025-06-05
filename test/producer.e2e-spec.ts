import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';

import { ProducerModule } from '../src/modules/producer/producer.module';

import { Crop } from '../src/modules/crop/entities/crop.entity';
import { Farm } from '../src/modules/farm/entities/farm.entity';
import { Producer } from '../src/modules/producer/entities/producer.entity';

describe('ProducerController (E2E)', () => {
  let app: INestApplication;

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
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/producers (POST) → cria produtor válido', () => {
    const dto = { name: 'Produtor Teste', cpfCnpj: '12116463947' };
    return request(app.getHttpServer())
      .post('/producers')
      .send(dto)
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe(dto.name);
        expect(res.body.cpfCnpj).toBe(dto.cpfCnpj);
      });
  });

  it('/producers (POST) → inválido retorna 400', () => {
    const dto = { name: 'Sem CPF' };
    return request(app.getHttpServer()).post('/producers').send(dto).expect(400);
  });

  it('/producers/:id (GET) → retorna 404 se não existir', () => {
    return request(app.getHttpServer()).get('/producers/nao-existe-id').expect(404);
  });

  it('/producers/:id (GET) → retorna produtor existente', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/producers')
      .send({ name: 'Teste Get', cpfCnpj: '11070208914' })
      .expect(201);
    const id = createRes.body.id;

    return request(app.getHttpServer())
      .get(`/producers/${id}`)
      .expect(200)
      .then((res) => {
        expect(res.body.id).toBe(id);
        expect(res.body.name).toBe('Teste Get');
      });
  });

  it('/producers/:id (PUT) → atualiza produtor e retorna 200', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/producers')
      .send({ name: 'Teste Atualiza', cpfCnpj: '80397057032' })
      .expect(201);
    const id = createRes.body.id;

    await request(app.getHttpServer())
      .put(`/producers/${id}`)
      .send({ name: 'Produtor Atualizado', cpfCnpj: '73074467070' })
      .expect(200);

    const res = await request(app.getHttpServer()).get(`/producers/${id}`).expect(200);

    expect(res.body.name).toBe('Produtor Atualizado');
  });

  it('/producers/:id (DELETE) → remove produtor e retorna 200', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/producers')
      .send({ name: 'Teste Deleta', cpfCnpj: '65568816000' })
      .expect(201);
    const id = createRes.body.id;

    await request(app.getHttpServer()).delete(`/producers/${id}`).expect(200);

    await request(app.getHttpServer()).get(`/producers/${id}`).expect(404);
  });
});
