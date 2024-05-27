import { Expose, Transform } from 'class-transformer';
import { CreateReportDto } from 'src/reports/dto/create-report.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';

export class ResponseUserDto {
  @Expose()
  title: string;
  @Expose()
  content: string;
  @Expose()
  level: number;

  @Transform(({ obj }) => ({
    id: obj.user.id,
    email: obj.user.email,
    role: obj.user.role,
  }))
  @Expose()
  user: User;
}
