import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from '../schemas/member.schema';
import { Model } from 'mongoose';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MemberSettings } from '../schemas/member-settings.schema';

@Injectable()
export class MembersService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<Member>,
    @InjectModel(MemberSettings.name)
    private memberSettingsModel: Model<MemberSettings>,
  ) {}

  async createMember({ settings, ...createMemberDto }: CreateMemberDto) {
    if (settings) {
      const newSettings = new this.memberSettingsModel(settings);
      const savedNewSettings = await newSettings.save();
      const newMember = new this.memberModel({
        ...createMemberDto,
        settings: savedNewSettings._id,
      });
      return newMember.save();
    }
    const newMember = new this.memberModel(createMemberDto);
    return newMember.save();
  }

  getsMembers() {
    return this.memberModel.find().populate(['settings', 'posts']);
  }

  getMemberById(id: string) {
    return this.memberModel.findById(id).populate(['settings', 'posts']);
  }

  async updateMember(id: string, updateMemberDto: UpdateMemberDto) {
    return await this.memberModel.findByIdAndUpdate(id, updateMemberDto);
  }

  deleteMember(id: string) {
    return this.memberModel.findByIdAndDelete(id);
  }
}
