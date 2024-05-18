import { Expose, Transform, Type } from 'class-transformer';
import { CreateReportDto } from 'src/reports/dto/create-report.dto';

export class ResponseUserDto {
  @Expose()
  userId: number;
  @Expose()
  email: string;
  @Expose()
  username: string;
  @Expose()
  nickname: string;
  @Expose()
  ip: string;
  @Type(() => CreateReportDto)
  @Expose()
  reports: CreateReportDto[];
}
