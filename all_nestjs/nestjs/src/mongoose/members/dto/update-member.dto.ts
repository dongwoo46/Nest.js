import { IsOptional, IsString, Max } from 'class-validator';

export class UpdateMemberDto {
  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
