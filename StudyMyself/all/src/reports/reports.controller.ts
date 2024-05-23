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
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Public } from 'src/auth/public.decorator';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { ResponseUserDto } from './dto/response-report.dto';
import { UsersService } from 'src/users/users.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/casl/check.policies';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Report } from './entities/report.entity';
import { Action } from 'src/casl/actions.enum';
import { ReadArticlePolicyHandler } from 'src/casl/policy.hander';

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

  // @Public() => guard 쓸때 제대로 안될 수 있음 왜냐하면 token에서 값을 가져오기전에 return true 해버림
  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Report))
  // @CheckPolicies(new ReadArticlePolicyHandler())
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
