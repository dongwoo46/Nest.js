import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateMemberSettingsDto {
  @IsOptional()
  @IsBoolean()
  receiveNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  receiveEmails?: boolean;

  @IsOptional()
  @IsBoolean()
  receiveSMS?: boolean;
}

export class CreateMemberDto {
  @IsNotEmpty()
  @IsString()
  membername: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsOptional()
  @ValidateNested() // 부모객체의 중첩된 객체에 대해서도 별도의 유효성 검사 실행
  @Type(() => CreateMemberSettingsDto)
  settings?: CreateMemberSettingsDto;
}
