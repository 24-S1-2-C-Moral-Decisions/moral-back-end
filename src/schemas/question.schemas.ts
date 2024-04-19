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

  static async mockQuestion(_id:string , studyId: string){
    const question = new Question();
    question._id = _id;
    question.studyId = studyId;
    question.title = 'Survey Title';
    question.text = 'Survey Question';
    question.count = 0;
    return question;
  }

  static async mockQuestions(studyId, number){
    const questions = [];
    for (let i = 0; i < number; i++){
      questions.push(Question.mockQuestion(i.toString(), studyId));
    }
    return questions;
  }
}

export const QuestionSchema = SchemaFactory.createForClass(Question);