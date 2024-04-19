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

  static async mockQuestion(_id:string , studyId: string){
    const question = new Question();
    question._id = _id;
    // question.studyId = studyId;
    question.title = 'Survey Title';
    // question.text = 'Survey Question';
    // question.count = 0;
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