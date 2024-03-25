import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Report } from 'src/reports/report.entity';
import { User } from 'src/users/user.entity';

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'sqlite', // db종류
  database: 'db.sqlite', //db이름
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
