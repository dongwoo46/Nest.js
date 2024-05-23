import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from 'src/auth/roles/role.enum';
import { DeepPartial } from 'typeorm';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  role: Role;

  @IsNumber()
  @IsNotEmpty()
  roleNumber: number;

  @IsString()
  nickname: string;

  @IsString()
  username: string;

  @IsString()
  ip: string;
}
