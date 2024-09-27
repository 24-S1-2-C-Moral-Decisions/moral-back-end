import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'all' })
export class PostDoc extends Document {
  @Prop({
    required: true,
    type: String
  })
  _id: string;

  @Prop({
    required: true,
    type: String
  })
  verdict: string;

  @Prop({
    required: true,
    type: String
  })
  title: string;

  @Prop({
    required: true,
    type: String
  })
  topic_1: string;

  @Prop({
    required: true,
    type: Number
  })
  topic_1_p: number;

  @Prop({
    required: true,
    type: String
  })
  topic_2: string;

  @Prop({
    required: true,
    type: Number
  })
  topic_2_p: number;

  @Prop({
    required: true,
    type: String
  })
  topic_3: string;

  @Prop({
    required: true,
    type: Number
  })
  topic_3_p: number;

  @Prop({
    required: true,
    type: String
  })
  topic_4: string;

  @Prop({
    required: true,
    type: Number
  })
  topic_4_p: number;

  @Prop({
    required: true,
    type: Number
  })
  num_comments: number;

  @Prop({
    required: true,
    type: String
  })
  resolved_verdict: string;

  @Prop({
    required: true,
    type: String
  })
  selftext: string;

  @Prop({
    required: true,
    type: Number
  })
  YTA: number;

  @Prop({
    required: true,
    type: Number
  })
  NTA: number;
}

export const PostDocSchema = SchemaFactory.createForClass(PostDoc);
