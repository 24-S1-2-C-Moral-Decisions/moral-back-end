import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class IndividualAnswer {
  @Prop({
    required: true,
    type: Boolean
  })
  isAsshole: boolean;

  @Prop({
    required: true,
    type: Number,
    min: 1,
    max: 5
  })
  rating: number;
}
export const IndividualAnswerSchema = SchemaFactory.createForClass(IndividualAnswer);

@Schema()
export class Answer {
  @Prop({
    required: true,
    type: String,
    length: 6
  })
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

  @Prop({
    required: true,
    type: Number,
    min: 1,
    max: 5
  })
  studyId: number;

  @Prop({type: AnswerSchema})
  answer: Answer;

  @Prop()
  comments: string;

  @Prop({ type: [Number], required: true })
  decisionMaking: number[];

  @Prop({ type: [Number], required: true })
  personalityChoice: number[];

  @Prop()
  time: number;
}

export type AnswersDocument = HydratedDocument<Answers>;
export const AnswersSchema = SchemaFactory.createForClass(Answers);