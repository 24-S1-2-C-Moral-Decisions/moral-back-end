import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from '../schemas/question.schemas';
import { Answers } from '../schemas/answers.shcemas';
import { StudyIdDto } from '../module/survey/studyId.dto';
import { AnswersDto } from '../module/survey/answers.dto';

@Injectable()
export class SurveyService {
    constructor(
        @InjectModel(Question.name) private questionModel: Model<Question>,
        @InjectModel(Answers.name) private answersModel: Model<Answers>
    ) { }

    async findQuestion(studyId: StudyIdDto): Promise<Question> {
        const question = await this.questionModel.findOne().sort({ [`count.${studyId.studyId}`]:1 }).exec();
        question.count[studyId.studyId] += 1;
        await question.save();
        return question;
    }

    async createAnswers(answers: AnswersDto): Promise<string>{
        await this.answersModel.create(answers);
        return "success";
    }

    // async initCount() {
    //     await this.questionModel.updateMany({}, { $set: { count: [0, 0, 0, 0, 0] } });
    //     return null;
    // }

}