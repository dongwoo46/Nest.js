import { Body, Controller, Post, Get, Query, Res } from '@nestjs/common';
import { AesService } from './aes.service';
import { Response } from 'express';
import { Public } from 'src/auth/public.decorator';
import * as path from 'path';

@Controller('aes')
export class AesController {
  constructor(private readonly aesService: AesService) {}

  @Public()
  @Post('encrypt')
  encrypt(@Body() data: any, @Res() res: Response): void {
    const key = 'rlaehddnkey';
    const iv = 'rlaehddniv';

    const output = path.resolve(
      'C:\\Users\\dw\\Desktop\\Nest.js\\all_nestjs\\nestjs\\src\\aes\\encrypted_file',
    );
    this.aesService.encryptObjectToFile(data, key, iv, output);
    res.send({ message: 'File encrypted successfully', path: output });
  }

  @Public()
  @Get('decrypt')
  decrypt(@Query('filePath') filePath: string, @Res() res: Response): void {
    const key = 'rlaehddnkey';
    const iv = 'rlaehddniv';
    const decryptedData = this.aesService.decryptFileToObject(
      filePath,
      key,
      iv,
    );
    res.json(decryptedData);
  }
}
