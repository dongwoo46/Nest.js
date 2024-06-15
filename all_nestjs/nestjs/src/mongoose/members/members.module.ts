import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Member, MemberSchema } from '../schemas/member.schema';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import {
  MemberSettings,
  MemberSettingsSchema,
} from '../schemas/member-settings.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Member.name,
        schema: MemberSchema,
      },
      {
        name: MemberSettings.name,
        schema: MemberSettingsSchema,
      },
    ]),
  ],
  providers: [MembersService],
  controllers: [MembersController],
})
export class MemberModule {}
