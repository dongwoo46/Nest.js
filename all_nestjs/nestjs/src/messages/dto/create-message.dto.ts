import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsInt()
  conversationId: number;
}
