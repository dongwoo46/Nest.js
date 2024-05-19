import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path, { extname } from 'path';
import { Response as expRes } from 'express';
import * as fs from 'fs';

@Controller('file1')
export class FileController {
  constructor(private config: ConfigService) {}

  // 파일 업로드
  // http://localhost:3000/file
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file) {
    const path = file.path.replace(this.config.get('ATTACH_SAVE_PATH'), '');
    // 원본파일명과 저장된 파일명을 리턴해서 다운로드 받을때 씀
    return {
      fileName: file.originalname,
      savedPath: path.replace(/\\/gi, '/'),
      size: file.size,
    };
  }

  // 파일 다운로드
  // http://localhost:3000/file/[savedPath]?fn=[fileName]
  // http://localhost:3000/file/202104/12312541515151.xlsx?fn=다운받을원본파일명.xlsx
  @Get('/download/:path/:name')
  async download(
    @Res() res: expRes,
    @Param('path') pathParam: string,
    @Param('name') name: string,
    @Query('fn') fileName?: string,
  ) {
    const filePath = path.join(
      this.config.get('ATTACH_SAVE_PATH'),
      pathParam,
      name,
    );

    // 파일이 존재하는지 확인
    if (!fs.existsSync(filePath)) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    // 파일을 다운로드하도록 응답
    res.download(filePath, fileName || name, (err) => {
      if (err) {
        throw new HttpException(
          'Error downloading file',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
  }
}
