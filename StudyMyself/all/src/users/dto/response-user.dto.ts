import { Expose, Transform } from 'class-transformer';
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
  @Transform(({ obj }) => obj.reports.map((report) => report))
  @Expose()
  reports: CreateReportDto[];
}
