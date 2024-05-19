import {
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response as expRes } from 'express';
import { Public } from 'src/auth/public.decorator';
import { FileExistGuard } from './file-exist.guard';
import { NoQueryGuard } from './no-query.guard';
import { createReadStream, createWriteStream, rename } from 'fs';
import { PDFDocument, StandardFonts } from 'pdf-lib';
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

  @UseGuards(NoQueryGuard, FileExistGuard)
  @Get('/download')
  downloadFile(@Req() req, @Res() res: expRes, @Query('file') file: string) {
    const filepath = `C:/Users/dw/Desktop/Nest.js/StudyMyself/all/src/file2/save2/${file}`;
    const fileShowName = 'download.txt';

    // 파일 존재 여부 확인
    // if (!fs.existsSync(filepath)) {
    //   throw new NotFoundException('파일을 찾을 수 없습니다.');
    // }

    res.download(filepath, fileShowName, (err) => {
      if (err) {
        res.status(500).send('File download failed');
      }
    });
  }

  // 변환시에 파일이 없으면 다운로드 못하고 에러 발생함
  @UseGuards(NoQueryGuard, FileExistGuard)
  @Get('/download/pdf')
  async downloadPdfFile(
    @Req() req,
    @Res() res: expRes,
    @Query('file') file: string,
  ) {
    const txtFilePath = `C:/Users/dw/Desktop/Nest.js/StudyMyself/all/src/file2/save2/${file}`;
    const pdfFilePath = `C:/Users/dw/Desktop/Nest.js/StudyMyself/all/src/file2/save2/${file.replace('.txt', '.pdf')}`;

    // txt 파일을 읽어와서 문자열로 변환
    const txtData = createReadStream(txtFilePath, 'utf-8');
    let txtContent = '';
    for await (const chunk of txtData) {
      txtContent += chunk;
    }

    // PDF 문서 생성
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    page.drawText(txtContent, {
      x: 50,
      y: page.getHeight() - 50,
      font: helveticaFont,
      size: 12,
    });

    // PDF 문서를 파일로 저장
    const pdfBytes = await pdfDoc.save();
    createWriteStream(pdfFilePath).write(pdfBytes, () => {
      // 파일 저장이 완료된 후에 다운로드 실행
      res.download(pdfFilePath, 'converted_file.pdf', (err) => {
        if (err) {
          res.status(500).send(err);
        }
      });
    });
  }
}
