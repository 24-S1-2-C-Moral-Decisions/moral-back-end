import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type QuestionDocument = HydratedDocument<Question>;

@Schema({ collection: 'posts' })
export class Question {
  @Prop({
    required: true,
    type: String,
    length: 6
  })
  _id: string;

  @Prop({
    required: true,
    type: String
  })
  title: string;

  @Prop({
    required: true,
    type: String
  })
  selftext: string;

  // @Prop()
  // annotated_top_judgments: number;

  // @Prop()
  // YA_group:number;

  // @Prop()
  // NA_group:number;

  @Prop({
    required: true,
    type: Number
  })
  very_certain_YA:number;

  @Prop({
    required: true,
    type: Number
  })
  very_certain_NA:number;

  @Prop({
    required: true,
    type: Number
  })
  YA_percentage:number;

  @Prop({
    required: true,
    type: Number
  })
  NA_percentage:number;

  // @Prop()
  // sorted_topic_pair:string;

  @Prop({
    required: true,
    type: [String]
  })
  original_post_YA_top_reasonings:string[];

  @Prop({
    required: true,
    type: [String]
  })
  original_post_NA_top_reasonings:string[];

  @Prop({
    required: true,
    type: [Number]
  })
  count: { [key: number]: number }
}

export const QuestionSchema = SchemaFactory.createForClass(Question);