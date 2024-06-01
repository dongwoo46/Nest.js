import { PartialType } from '@nestjs/mapped-types';
import { CreateCryptoSignDto } from './create-crypto-sign.dto';

export class UpdateCryptoSignDto extends PartialType(CreateCryptoSignDto) {}
