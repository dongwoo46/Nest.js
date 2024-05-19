import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response as expRes } from 'express';
import { Public } from 'src/auth/public.decorator';

@Controller('file2')
@Public()
export class File2Controller {
  @Post('/upload-single')
  @UseInterceptors(FileInterceptor('file')) //
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return file;
  }

  @Post('/upload-multi')
  @UseInterceptors(FilesInterceptor('file')) // 이 부분과
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    // 이 부분만 바뀌었다.
    // 여기서 Express.Multer.File[]은 Array<Express.Multer.File>으로도 사용 가능하다.
    // Array<Express.Multer.File> 을 쓰는 것이 더 나을듯?
    const fileArray = [];
    files.forEach((element) => {
      fileArray.push(element);
    });
    return fileArray;
  }

  @Post('/upload-file-mine')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination:
          'C:/Users/dw/Desktop/Nest.js/StudyMyself/all/src/file2/save2/',
        filename(_, file, callback): void {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadFileUserController(@UploadedFile() file: Express.Multer.File) {
    return {
      url: `http://localhost:3000/save/${file.filename}`,
    };
  }

  @Get('/download')
  downloadFile(@Req() req, @Res() res: expRes, @Query('file') file: string) {
    const filepath = `C:/Users/dw/Desktop/Nest.js/StudyMyself/all/src/file2/save2/${file}`;
    const fileShowName = 'download';

    res.download(filepath, fileShowName, (err) => {
      if (err) {
        res.status(500).send('File download failed');
      }
    });
  }
}
