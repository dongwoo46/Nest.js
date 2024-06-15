import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class MemberSettings {
  @Prop({ required: false })
  receiveNotifications?: boolean;

  @Prop({ required: false })
  receiveEmails?: boolean;

  @Prop({ required: false })
  receiveSMS?: boolean;
}

export const MemberSettingsSchema =
  SchemaFactory.createForClass(MemberSettings);
