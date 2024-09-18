import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from '../schemas/question.schemas';
import { Answers } from '../schemas/answers.shcemas';
import { StudyIdDto } from '../module/survey/studyId.dto';
import { AnswerIdDto, AnswersDto } from '../module/survey/answers.dto';

@Injectable()
export class SurveyService {
    constructor(
        @InjectModel(Question.name) private questionModel: Model<Question>,
        @InjectModel(Answers.name) private answersModel: Model<Answers>
    ) { }

    async findQuestion(studyId: StudyIdDto): Promise<Question> {
        const question = await this.questionModel.findOne().sort({ [`count.${studyId.studyId}`]:1 }).exec();
        if (studyId.studyId > 0 && question.count.length < studyId.studyId) {
            throw new Error('studyId out of range, should be [1, 5]');
        }
        question.count[studyId.studyId] += 1;
        await question.save();
        return question;
    }

    async createAnswers(answers: AnswersDto): Promise<string>{  
        const res = await this.answersModel.create(answers);
        return res._id.toString(); 
    }

    async findAnswersById(id: AnswerIdDto): Promise<Answers> {
        return this.answersModel.findById(id).exec();
    }

    // async initCount() {
    //     await this.questionModel.updateMany({}, { $set: { count: [0, 0, 0, 0, 0] } });
    //     return null;
    // }

}