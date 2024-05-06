import { ConfigFactory, ConfigService, registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  return {
    type: configService.get<'mysql' | 'mariadb'>('DATABASE_TYPE', 'mysql'),
    host: configService.get<string>('DATABASE_HOST', 'localhost'),
    port: parseInt(configService.get<string>('DATABASE_PORT', '5432'), 10),
    username: configService.get<string>('DATABASE_USER', 'root'),
    password: configService.get<string>('DATABASE_PASSWORD', '1234'),
    database: configService.get<string>('DATABASE_DATABASE', 'new'),
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE', false),
    logging: true,
  };
};
