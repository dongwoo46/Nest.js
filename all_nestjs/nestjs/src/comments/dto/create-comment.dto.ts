import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { IsNull } from 'typeorm';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  reportId: number;
}
