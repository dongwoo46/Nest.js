import { PartialType } from '@nestjs/mapped-types';
import { CreateFile3Dto } from './create-file3.dto';

export class UpdateFile3Dto extends PartialType(CreateFile3Dto) {}
