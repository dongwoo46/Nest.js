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
}
