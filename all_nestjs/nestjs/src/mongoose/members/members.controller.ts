import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { Public } from 'src/auth/public.decorator';
import mongoose from 'mongoose';
import { UpdateMemberDto } from './dto/update-member.dto';

@Public()
@Controller('members')
export class MembersController {
  constructor(private membersService: MembersService) {}
  @Post()
  createMember(@Body() createMemberDto: CreateMemberDto) {
    return this.membersService.createMember(createMemberDto);
  }

  @Get()
  async getMembers() {
    return await this.membersService.getsMembers();
  }

  @Get(':id')
  async getMemberById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('user not found', 404);
    const findMember = await this.membersService.getMemberById(id);
    if (!findMember) throw new HttpException('user not found', 404);

    return findMember;
  }

  @Patch(':id')
  async updateMember(
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 404);
    return await this.membersService.updateMember(id, updateMemberDto);
  }

  @Delete(':id')
  async deleteMember(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 404);
    const deleteMember = await this.membersService.deleteMember(id);
    if (!deleteMember) throw new HttpException('user not found', 404);
    return;
  }
}
