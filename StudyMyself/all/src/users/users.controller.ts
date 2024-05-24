import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Inject,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/auth/public.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { ResponseUserDto } from './dto/response-user.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';
import { VerifyEmailDto } from 'src/email/verify-email.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EmailFailException } from 'src/exceptions/email-fail.exception';
import { EmailService } from 'src/email/email.service';
import * as uuid from 'uuid';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    //Logger를 import할 때 WinstonLogger를 nest-winston이 아니라 winston에서 Logger import!!!
    // 만약 nest-winston에서 WinstonLogger가져오면 정의가 안될것
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly winstonLogger: WinstonLogger,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly emailService: EmailService,
  ) {}

  private printWinstonLog(dto) {
    this.winstonLogger.error('error: ', dto);
    this.winstonLogger.warn('warn: ', dto);
    this.winstonLogger.info('info: ', dto);
    this.winstonLogger.http('http: ', dto);
    this.winstonLogger.verbose('verbose: ', dto);
    this.winstonLogger.debug('debug: ', dto);
    this.winstonLogger.silly('silly: ', dto);
  }

  @Post()
  @Public()
  create(@Body() createUserDto: CreateUserDto) {
    this.printWinstonLog(createUserDto);
    return this.usersService.signUp(createUserDto);
  }

  @Get()
  @Serialize(ResponseUserDto)
  // @Roles(Role.Admin)
  // @UseGuards(RolesGuard)
  findAll() {
    return this.usersService.getAllUsers();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  // @Public()
  // url로 들어오는거 체크하는 로직
  // @Post('/email-verify-form')
  // async verifyEmail(@Query() dto: VerifyEmailDto): Promise<boolean> {
  // const { signupVerifyToken } = dto;
  // const token = await this.cacheManager.get('signupVerifyToken');
  // if (token === signupVerifyToken) {
  //   return true;
  // }
  // return false;
  // }

  @Public()
  // 인증토큰을 자기가 직접 input에 써서 체크하는 로직
  @Post('/email-verify-token')
  async verifyToken(@Body() dto: VerifyEmailDto): Promise<boolean> {
    const signupVerifyToken = uuid.v1();
    await this.cacheManager.set('signupVerifyToken', signupVerifyToken, 300000); //3분간 생존하는 데이터
    const a = await this.cacheManager.get('signupVerifyToken');
    console.log(a); // value
    const { email } = dto;
    await this.emailService.sendSignUpVerifyToken(email, signupVerifyToken);

    let count = 1;
    const token = await this.cacheManager.get('signupVerifyToken');
    while (count < 6) {
      if (token === signupVerifyToken) {
        return true;
      }
    }
    await this.cacheManager.del('signupVerifyToken');

    throw new EmailFailException();
  }
}
