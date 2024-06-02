import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateChatDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
