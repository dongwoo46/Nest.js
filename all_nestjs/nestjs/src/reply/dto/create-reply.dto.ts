import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateReplyDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  commentId: number;

  @IsOptional()
  @IsNumber()
  parentId?: number;
}
