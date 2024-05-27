import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  isNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
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

  @IsBoolean()
  @Transform(({ value }) => (value !== undefined ? value : true)) // 기본값 true로 설정
  isPublished: boolean;
}
