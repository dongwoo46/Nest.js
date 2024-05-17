import { IsNotEmpty, isNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsNull } from 'typeorm';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  content: string;
  @IsNumber()
  @IsNotEmpty()
  level: number;
}
