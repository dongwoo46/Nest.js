import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  UseGuards,
} from '@nestjs/common';
import { File3Service } from './file3.service';
import { CreateFile3Dto } from './dto/create-file3.dto';
import { UpdateFile3Dto } from './dto/update-file3.dto';
import { createCipheriv, randomBytes, scryptSync } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { Response as expRes } from 'express';
import { TokenGuard } from './token.guard';

@Controller('file3')
export class File3Controller {
  constructor(private readonly file3Service: File3Service) {}

  @Get('encrypt')
  async encryptFile(@Res() res: expRes) {
    const filePath =
      'C:/Users/dw/Desktop/Nest.js/all_nestjs/nestjs/src/file3/save3/sqldump3.txt';
    try {
      const encryptedFilePath = await this.file3Service.encryptFile(filePath);
      const token = this.file3Service.generateQueryToken(encryptedFilePath);
      return res.status(200).json({ encryptedFilePath, token }); // res.json() 대신 return 사용
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'File encryption failed', error: error.message }); // .status()와 .json()을 별도로 분리
    }
  }

  @UseGuards(TokenGuard)
  @Get('download')
  async downloadFile(@Query('token') token: string, @Res() res: expRes) {
    try {
      const decoded = this.file3Service.verifyQueryToken(token);
      const filePath = decoded.filePath;

      if (filePath) {
        return res.download(filePath);
      } else {
        return res
          .status(403)
          .json({ message: 'Unauthorized access to the file' });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'File download failed', error: error.message });
    }
  }
}
