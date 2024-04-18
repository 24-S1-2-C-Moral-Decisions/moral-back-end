import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnswersDto } from 'src/module/survey/answers.dto';
import { StudyIdDto } from 'src/module/survey/studyId.dto';
import { Answers } from 'src/schemas/answers.shcemas';
import { Question } from 'src/schemas/question.schemas';

@Injectable()
export class SurveyService {
    constructor(
        @InjectModel(Question.name) private questionModel: Model<Question>,
        @InjectModel(Answers.name) private answersModel: Model<Answers>
    ) { }

    async findQuestions(studyId:StudyIdDto){
        const questions=await this.questionModel.find({studyId:studyId.studyId}).sort({count:1}).limit(3);
        await Promise.all(
            questions.map(async (question) => {
              question.count += 1;
              await question.save();
              return question;  
            })
          );
        return questions;
    }

    async createAnswers(answers:AnswersDto):Promise<Answers>{
        const createAnswers=new this.answersModel(answers);
        return createAnswers.save();
    }

}