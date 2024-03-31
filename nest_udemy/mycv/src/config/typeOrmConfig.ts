import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'sqlite', // db종류
  database: 'db.sqlite', //db이름
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
