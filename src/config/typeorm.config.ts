import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'Vin@0920',
  database: process.env.DB_NAME || 'brain_agriculture',
  entities: [join(__dirname, '/../**/*.entity.{ts,js}')],
  migrations: [join(__dirname, '/../migrations/**/*{.ts,.js}')],
  synchronize: false, // em produção prefira migrations ao invés de true
};
