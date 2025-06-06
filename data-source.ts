import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Crop } from './src/modules/crop/entities/crop.entity';
import { Farm } from './src/modules/farm/entities/farm.entity';
import { Producer } from './src/modules/producer/entities/producer.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'Vin@0920',
  database: process.env.DB_NAME || 'brain_agriculture',
  schema: 'public',
  entities: [Producer, Farm, Crop],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  // ssl: false,
  ssl: {
    rejectUnauthorized: false,
  },
});
