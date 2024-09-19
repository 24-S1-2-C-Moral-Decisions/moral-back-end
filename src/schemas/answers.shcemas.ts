import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { StudyIdDto } from '../module/survey/studyId.dto';
import { AnswerIdDto, AnswersDto } from '../module/survey/answers.dto';

export const mockAnswer = new AnswersDto({
  id: new AnswerIdDto('60f7c72b8f3f5e001f8c84b4'),
  prolificId: "prolific-id-1",
  studyId: new StudyIdDto(1),
  answer: {
    questionId: "atcfwx",
    individualAnswer: {
      isAsshole: true,
      rating: 1
    },
    groupAnswer: {
      isAsshole: true,
      rating: 1
    },
  },
  decisionMaking: [
    1, 2, 3, 4, 5,
    1, 2, 3, 4, 5,
    1, 2, 3, 4, 5,
    1, 2, 3, 4, 5,
    1, 2, 3, 4, 5
  ],
  personalityChoice: [
    1, 2, 3, 4, 5,
    1, 2, 3, 4, 5,
    1, 2, 3, 4, 5
  ],
  time: 123456789
});

export const mockAnswersModel = {
  create: () => {
    return {
      _id: mockAnswer.id,
      toString: () => {
        return mockAnswer.toString();
      }
    }
  },
  findById: (id: AnswerIdDto) => {
    return {
      exec: () => {
        if (mockAnswer.id == id) return mockAnswer;
        else return null;
      }
    }
  }
};

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

  @Prop({
    type: Types.ObjectId,
    default: () => new Types.ObjectId(),
    unique: true,
    toJSON: {
      virtuals: false,
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      }
    },
    toObject: {
      virtuals: false,
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  })
  id: Types.ObjectId;

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