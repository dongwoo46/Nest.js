import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CryptoSignService } from './crypto-sign.service';
import { CreateCryptoSignDto } from './dto/create-crypto-sign.dto';
import { UpdateCryptoSignDto } from './dto/update-crypto-sign.dto';

@Controller('crypto-sign')
export class CryptoSignController {
  constructor(private readonly cryptoSignService: CryptoSignService) {}

  @Post()
  create(@Body() createCryptoSignDto: CreateCryptoSignDto) {
    return this.cryptoSignService.create(createCryptoSignDto);
  }

  @Get()
  findAll() {
    return this.cryptoSignService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cryptoSignService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCryptoSignDto: UpdateCryptoSignDto) {
    return this.cryptoSignService.update(+id, updateCryptoSignDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cryptoSignService.remove(+id);
  }
}
