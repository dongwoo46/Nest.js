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
  Sse,
  Req,
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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { filter, fromEvent, map, Observable } from 'rxjs';
import { Request as exReq } from 'express';
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

    private readonly eventEmitter: EventEmitter2,
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

  /**
   * sse 유저 생성시 알림가기!!
   * @description
   * return 필요하면 client.send
   * return 필요없으면 client.emit
   */
  @Post('/sse-create-user')
  @Public()
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Req() req: exReq,
  ): Promise<any> {
    const userIp = req.ip;
    const user = await this.usersService.signUp({
      ...createUserDto,
      ip: userIp,
    });
    this.eventEmitter.emit('create-user', user); // 생성된 유저 객체를 이벤트로 전송
    return user;
  }

  /**
   * create user되기전에
   * curl http://localhost:3000/users/sse로 통신 켜놓기
   * 그뒤에 createUser하기
   * user정보 확인하지 않고 그냥 생성만되면 계속 출력함
   */
  @Sse('sse')
  @Public()
  sse(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'create-user').pipe(
      map(
        (user: any) =>
          new MessageEvent('message', {
            data: {
              message: 'User created',
              user: user, // include user object
            },
          }),
      ),
    );
  }

  /**
   *
   * @param userId
   * @returns
   * 각 이벤트에서 보내주는 data를 비교해서 값이 동일한 경우에만 반환하면 다른 유저는 받지않음
   * 주로 같은 채팅방에 속한 유저들에게 특정한 이벤트 발생시 알람을 주기위해 chatRoomId에 이용가능
   */
  @Sse('sse/:userId')
  @Public()
  sseIdentifyUser(@Param('userId') userId: number): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'create-user').pipe(
      filter((user: any) => user.userId === userId), // userId가 일치하는 경우에만 진행
      map(
        (user: any) =>
          new MessageEvent('message', {
            data: {
              message: 'User created',
              user: user, // 유저 객체 포함
            },
          }),
      ),
    );
  }
}
