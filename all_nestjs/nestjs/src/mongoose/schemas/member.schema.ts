import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { MemberSettings } from './member-settings.schema';
import { Post } from './post.schema';

@Schema()
export class Member {
  @Prop({ unique: true, required: true })
  membername: string;

  @Prop({ required: false })
  displayName?: string;

  @Prop({ required: false })
  avataUrl?: string;

  //One to One
  @Prop({ type: mongoose.Schema.Types.ObjectId, refs: 'MemberSettings' })
  settings?: MemberSettings;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] })
  posts: Post[];
}

export const MemberSchema = SchemaFactory.createForClass(Member);
