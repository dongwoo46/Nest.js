import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Member } from './member.schema';

@Schema()
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  contents: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Member' })
  member: Member;
}

export const PostSchema = SchemaFactory.createForClass(Post);
