import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EccSignService } from './ecc-sign.service';
import { CreateEccSignDto } from './dto/create-ecc-sign.dto';
import { UpdateEccSignDto } from './dto/update-ecc-sign.dto';
import { ec as EC } from 'elliptic';
import { Public } from 'src/auth/public.decorator';

@Public()
@Controller('ecc-sign')
export class EccSignController {
  constructor(private readonly eccSignService: EccSignService) {}

  @Get('keys')
  getKeys() {
    return this.eccSignService.getKeys();
  }

  @Post('sign')
  createSignature(@Body('data') data: string) {
    const signature = this.eccSignService.createEccSignature(data);
    return { data, signature };
  }

  @Post('verify')
  verifySignature(
    @Body('data') data: string,
    @Body('publicKey') publicKey: string,
    @Body('signature') signature: string,
  ) {
    const isValid = this.eccSignService.verifyEccSignature(
      data,
      publicKey,
      signature,
    );
    return { data, signature, isValid };
  }
  @Post()
  create(@Body() createEccSignDto: CreateEccSignDto) {
    return this.eccSignService.create(createEccSignDto);
  }

  @Get()
  findAll() {
    return this.eccSignService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eccSignService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEccSignDto: UpdateEccSignDto) {
    return this.eccSignService.update(+id, updateEccSignDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eccSignService.remove(+id);
  }
}
