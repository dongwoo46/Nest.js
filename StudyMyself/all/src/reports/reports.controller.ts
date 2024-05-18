import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Logger,
  Req,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Public } from 'src/auth/public.decorator';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { ResponseUserDto } from './dto/response-report.dto';
import { UsersService } from 'src/users/users.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly usersService: UsersService,
  ) {}
  private readonly logger = new Logger(ReportsController.name);

  @Post()
  @Serialize(ResponseUserDto)
  async create(@Body() createReportDto: CreateReportDto, @Req() req) {
    const user = await this.usersService.findOneByEmail(req.user.email);

    return this.reportsService.create(createReportDto, user);
  }

  @Public()
  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(+id, updateReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportsService.remove(+id);
  }
}
