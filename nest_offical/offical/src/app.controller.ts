import {
  Controller,
  Get,
  Res,
  Req,
  Session,
  Render,
  UseInterceptors,
  Post,
  Body,
  UploadedFile,
  ParseFilePipeBuilder,
  UploadedFiles,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import { Cookies } from './decorators/cookie.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { SampleDto } from './sample.dto';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Get()
  async root(@Res() res: Response) {
    // Handlebars 템플릿 렌더링
    res.render('index', { message: 'Hellos from NestJS with Handlebars!' });
  }

  @Get('/set-cookie')
  setCookie(@Res() res: Response) {
    // 쿠키 설정
    res.cookie('dongwoo2', 'dongwoosCookie2', {
      maxAge: 1000 * 60 * 60 * 24, // 쿠키 유효기간 24시간
      httpOnly: true, // 클라이언트의 JavaScript에서 쿠키에 접근할 수 없도록 설정
    });

    // 성공 응답
    return res.send('쿠키가 설정되었습니다.');
  }

  @Get('/get-cookie')
  getCookie(@Req() req: Request) {
    // 쿠키 가져오기
    const cookieValue = req.cookies['dongwoo2'];

    // 쿠키 값이 존재하는지 확인
    if (cookieValue) {
      return `쿠키 값: ${cookieValue}`;
    } else {
      return '쿠키가 존재하지 않습니다.';
    }
  }

  @Get('/get-cookie')
  getCookie2(@Cookies() cookies: any) {
    return cookies; // 모든 쿠키를 가져옴
  }

  @Get('/get-specific-cookie')
  getSpecificCookie(@Cookies('cookieName') cookieValue: string) {
    return cookieValue; // 특정 쿠키 값만 가져옴
  }

  @Get('/set-session')
  setSession(@Session() session: Record<string, any>) {
    session.user = { name: 'John', age: 30 }; // 세션에 사용자 정보 저장
    return 'Session set';
  }

  @Get('/get-session')
  getSession(@Session() session: Record<string, any>) {
    console.log('sfsdfsdf');
    const user = session.user; // 세션에서 사용자 정보 가져오기
    return user ? user : 'No session data available';
  }
  // @Get()
  // officalSessionExample(@Session() session: Record<string, any>) {
  //   session.visits = session.visits ? session.visits + 1 : 1;
  // }

  @UseInterceptors(FileInterceptor('file'))
  @Post('file2')
  uploadFileAppController(
    @Body() body: SampleDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return {
      body,
      file: file.buffer.toString(),
    };
  }

  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files', // 파일을 저장할 경로
        filename: (req, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadFileDiskStorage(@UploadedFile() file: Express.Multer.File) {
    // 업로드된 파일의 정보를 반환하거나 처리합니다.
    return {
      filename: file.filename,
      originalname: file.originalname,
      // 기타 필요한 정보
    };
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('file/pass-validation')
  uploadFileAndPassValidation(
    @Body() body: SampleDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'json',
        })
        .build({
          fileIsRequired: false,
        }),
    )
    file?: Express.Multer.File,
  ) {
    return {
      body,
      file: file?.buffer.toString(),
    };
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('file/fail-validation')
  uploadFileAndFailValidation(
    @Body() body: SampleDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpg',
        })
        .build(),
    )
    file: Express.Multer.File,
  ) {
    return {
      body,
      file: file.buffer.toString(),
    };
  }

  // 다중 파일 업로드
  @Post('/uploads')
  @UseInterceptors(FilesInterceptor('files')) // FilesInterceptor
  // @UseInterceptors(FilesInterceptor('files', 3)) // 업로드 파일을 3개로 제한
  // @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 1 }])) // name 값이 files에 대한 limit
  // @UseInterceptors(AnyFilesInterceptor()) // 모든 파일 받기
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    // UploadedFiles
    console.log(files);
  }
}
