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
        // @InjectModel(Question.name, 'survey') private questionModel: Model<Question>,
        // @InjectModel(Answers.name, 'survey') private answersModel: Model<Answers>
    ) { }

    async findQuestion(studyId: StudyIdDto): Promise<Question> {
        // const question = await this.questionModel.findOne().sort({ [`count.${studyId.studyId}`]:1 }).exec();
        //         if (studyId.studyId > 0 && Object.keys(question.count).length < studyId.studyId) {
        //     throw new Error('studyId out of range, should be [1, ' + Object.keys(question.count).length + ']');
        // }
        // question.count[studyId.studyId] = (question.count[studyId.studyId] || 0) + 1;
        // await question.save();
        // return question;
        return null;
    }

    async createAnswers(answers: AnswersDto): Promise<string>{  
        if (answers.decisionMaking === undefined) {
            throw new Error('Decision making results are required');
        }
        if (answers.decisionMaking.length !== 25) {
            throw new Error('Decision making array must have 25 items');
        }
        answers.decisionMaking.map((item) => {
            if (item < 1 || item > 5) {
                throw new Error('The value of Decision making question must between [1,5]');
            }
        });

        if (answers.personalityChoice === undefined) {
            throw new Error('Personality choice results are required');
        }
        if (answers.personalityChoice.length !== 15) {
            throw new Error('Personality choice array must have 15 items');
        }
        answers.personalityChoice.map((item) => {
            if (item < 1 || item > 5) {
                throw new Error('The value of Personality choice question must between [1,5]');
            }
        });
        
        // const res = await this.answersModel.create(answers);
        // return res._id.toString(); 
        return null;
    }

    async findAnswersById(id: AnswerIdDto): Promise<Answers> {
        // return this.answersModel.findById(id).exec();
        return null;
    }

    // async initCount() {
    //     await this.questionModel.updateMany({}, { $set: { count: [0, 0, 0, 0, 0] } });
    //     return null;
    // }

}