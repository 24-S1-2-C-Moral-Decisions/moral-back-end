import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type QuestionDocument = HydratedDocument<Question>;

@Schema({ collection: 'posts' })
export class Question {
  @Prop()
  _id: string;

  @Prop()
  title: string;

  @Prop()
  selftext: string;

  @Prop()
  annotated_top_judgments: number;

  @Prop()
  YA_group:number;

  @Prop()
  NA_group:number;

  @Prop()
  very_certain_YA:number;

  @Prop()
  very_certain_NA:number;

  @Prop()
  YA_percentage:number;

  @Prop()
  NA_percentage:number;

  @Prop()
  sorted_topic_pair:string;

  @Prop()
  original_post_YA_top_reasonings:string[];

  @Prop()
  original_post_NA_top_reasonings:string[];

  @Prop()
  count: number[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);