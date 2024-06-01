import { PartialType } from '@nestjs/mapped-types';
import { CreateRsaSignDto } from './create-rsa-sign.dto';

export class UpdateRsaSignDto extends PartialType(CreateRsaSignDto) {}
