import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type QuestionDocument = HydratedDocument<Question>;

@Schema({ collection: 'questions' })
export class Question {
  @Prop()
  _id: string;

  @Prop()
  studyId: string;

  @Prop()
  title: string;

  @Prop()
  text: string;

  @Prop()
  count: number;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);