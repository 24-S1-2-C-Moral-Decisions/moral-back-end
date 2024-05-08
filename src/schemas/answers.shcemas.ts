import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class IndividualAnswer {
  @Prop()
  isAsshole: boolean;

  @Prop()
  rating: number;
}
export const IndividualAnswerSchema = SchemaFactory.createForClass(IndividualAnswer);

@Schema()
export class Answer {
  @Prop()
  questionId: string;

  @Prop({ type: IndividualAnswerSchema})
  individualAnswer: IndividualAnswer;

  @Prop({ type: IndividualAnswerSchema})
  groupAnswer: IndividualAnswer;

  @Prop()
  comments: string;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);

@Schema({ collection: 'answers' })
export class Answers{

  @Prop()
  prolificId: string;

  @Prop()
  studyId: string;

  @Prop({type: AnswerSchema})
  answers: Answer;

  @Prop()
  comments: string;
}

export type AnswersDocument = HydratedDocument<Answers>;
export const AnswersSchema = SchemaFactory.createForClass(Answers);