import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
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
import {
  appendFile,
  createReadStream,
  createWriteStream,
  readFileSync,
  rename,
  writeFileSync,
} from 'fs';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import * as archiver from 'archiver';
import { createCipheriv, randomBytes } from 'crypto';
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

  //npm install archiver 사용
  @Post('/upload-multi-zip')
  @UseInterceptors(FilesInterceptor('file')) // 이 부분과
  async uploadFilesZip(@UploadedFiles() files: Express.Multer.File[]) {
    const archive = archiver('zip');
    const output = createWriteStream('output.zip');
    archive.pipe(output);
    // 각 파일을 압축 파일에 추가
    files.forEach((file) => {
      archive.append(createReadStream(file.path), { name: file.originalname });
    });

    // 압축 파일 생성 완료 후 응답
    await archive.finalize();
    const fileArray = [];
    files.forEach((element) => {
      fileArray.push(element);
    });
    return fileArray;
  }

  @Post('/make-zip')
  async makeZipFile(@Res() res: expRes) {
    // 특정 폴더 경로 설정
    const folderPath =
      'C:/Users/dw/Desktop/Nest.js/StudyMyself/all/src/file2/save2';
    // 압축 파일 경로 설정
    const zipFilePath =
      'C:/Users/dw/Desktop/Nest.js/StudyMyself/all/src/file2/save2/archive.zip';

    // archiver 인스턴스 생성
    const archive = archiver('zip', { zlib: { level: 9 } });
    // 압축 파일 생성을 위한 스트림 생성
    const output = createWriteStream(zipFilePath);

    // 압축 파일 스트림에 연결
    archive.pipe(output);

    // 특정 폴더의 파일들을 읽어서 압축 파일에 추가
    archive.directory(folderPath, false);

    // 압축 파일 생성 완료 후 압축 파일 닫기
    archive.finalize();

    output.on('close', () => {
      const responseData = {
        message: 'zip 파일이 생성되었습니다.',
        zipFilePath: zipFilePath,
      };
      return res.status(HttpStatus.CREATED).send(responseData);
    });
    // 압축 파일 생성 완료 이벤트 처리

    // 압축 파일 생성 중 에러 처리
    archive.on('error', (err) => {
      throw new BadRequestException('파일 생성에 실패했습니다. ');
    });
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

  @Post('/make-query-dump')
  async makeQueryDump(@Res() res: expRes) {
    // 저장할 쿼리
    const queries = [
      'SELECT * FROM users',
      'SELECT * FROM products',
      'SELECT * FROM orders WHERE status = "pending"',
      'SELECT * FROM customers WHERE country = "USA"',
    ];

    // 저장할 파일 경로
    const filePath =
      'C:/Users/dw/Desktop/Nest.js/StudyMyself/all/src/file2/save2/sqldump.txt';

    // 쿼리를 파일에 추가하는 함수
    function saveQueryToFile(queries: string[], filePath: string) {
      const promises = queries.map((query) => {
        return new Promise<void>((resolve, reject) => {
          appendFile(filePath, query + '\n', (err) => {
            if (err) {
              reject(
                new BadRequestException(
                  '쿼리를 파일에 저장하는 중 오류가 발생했습니다: ' +
                    err.message,
                ),
              );
            } else {
              resolve();
            }
          });
        });
      });

      Promise.all(promises)
        .then(() => {
          res
            .status(HttpStatus.CREATED)
            .send('쿼리가 파일에 성공적으로 저장되었습니다.');
        })
        .catch((error) => {
          throw error; // HTTP 응답은 위에서 처리되므로 여기서는 예외만 다시 던집니다.
        });
    }

    // 쿼리를 파일에 추가
    saveQueryToFile(queries, filePath);
  }

  // 파일내용 암호화하기
  @Post('/encrypt')
  async encryptFile(@Res() res: expRes) {
    try {
      const inputFile =
        'C:/Users/dw/Desktop/Nest.js/StudyMyself/all/src/file2/save2/sqldump.txt'; // 암호화할 파일 경로
      const encryptedFile =
        'C:/Users/dw/Desktop/Nest.js/StudyMyself/all/src/file2/save2/sqldumpcrypto.txt'; // 암호화된 파일 저장 경로
      const algorithm = 'aes-256-cbc'; // 암호화 알고리즘
      const key = randomBytes(32); // 암호화에 사용할 키

      // 파일 읽기
      const input = readFileSync(inputFile);

      // 암호화 키 생성
      const iv = randomBytes(16); // 16바이트(128비트) IV 생성

      // 암호화
      const cipher = createCipheriv(algorithm, Buffer.from(key), iv);
      const encryptedData = Buffer.concat([
        cipher.update(input),
        cipher.final(),
      ]);

      // 암호화된 내용을 파일에 저장
      writeFileSync(
        encryptedFile,
        iv.toString('hex') + encryptedData.toString('hex'),
      );

      // 암호화된 파일을 클라이언트에게 응답
      res.status(200).sendFile(encryptedFile);
    } catch (error) {
      res.status(500).send('암호화 오류: ' + error.message);
    }
  }
}
