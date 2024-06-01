import { PartialType } from '@nestjs/mapped-types';
import { CreateEccSignDto } from './create-ecc-sign.dto';

export class UpdateEccSignDto extends PartialType(CreateEccSignDto) {}
