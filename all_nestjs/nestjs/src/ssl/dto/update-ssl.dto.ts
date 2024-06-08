import { PartialType } from '@nestjs/mapped-types';
import { CreateSslDto } from './create-ssl.dto';

export class UpdateSslDto extends PartialType(CreateSslDto) {}
