import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RsaSignService } from './rsa-sign.service';
import { CreateRsaSignDto } from './dto/create-rsa-sign.dto';
import { UpdateRsaSignDto } from './dto/update-rsa-sign.dto';
import { Public } from 'src/auth/public.decorator';

@Public()
@Controller('rsa-sign')
export class RsaSignController {
  constructor(private readonly rsaSignService: RsaSignService) {}

  @Get('keys')
  getKeys() {
    return this.rsaSignService.generateKeys();
  }

  @Post('sign')
  createSignature(
    @Body('data') data: string,
    @Body('privateKey') privateKey: string,
  ) {
    const signature = this.rsaSignService.createSignature(data, privateKey);
    return { data, signature };
  }

  @Post('verify')
  verifySignature(
    @Body('data') data: string,
    @Body('publicKey') publicKey: string,
    @Body('signature') signature: string,
  ) {
    const isValid = this.rsaSignService.verifySignature(
      data,
      publicKey,
      signature,
    );
    return { data, signature, isValid };
  }

  @Post()
  create(@Body() createRsaSignDto: CreateRsaSignDto) {
    return this.rsaSignService.create(createRsaSignDto);
  }

  @Get()
  findAll() {
    return this.rsaSignService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rsaSignService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRsaSignDto: UpdateRsaSignDto) {
    return this.rsaSignService.update(+id, updateRsaSignDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rsaSignService.remove(+id);
  }
}
