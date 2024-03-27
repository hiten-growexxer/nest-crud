import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from '../model/user.entity';
config({ path: process.env.NODE_ENV + '.env' });

const configService = new ConfigService();
export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOSTNAME'),
  //   port: configService.get('POSTGRES_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [User],
  ssl: process.env.NODE_ENV === 'production',
  migrations:
    process.env.NODE_ENV === 'testing'
      ? ['src/db/testmigrations/**/*.{ts,js}']
      : ['src/db/migrations/**/*.{ts,js}'],
});
