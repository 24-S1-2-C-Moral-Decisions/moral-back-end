import { Injectable } from '@nestjs/common';
import { StudyIdDto } from '../module/survey/studyId.dto';
import { Question } from '../entity/Question';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Answer } from '../entity/Answer';
import { ObjectId } from 'mongodb';

@Injectable()
export class SurveyService {
    constructor(
        @InjectRepository(Answer, 'survey') private answerRepository: MongoRepository<Answer>,
        @InjectRepository(Question, 'survey') private questionRepository: MongoRepository<Question>,
    ) { }

    async findQuestion(studyId: StudyIdDto): Promise<Question> {
        const questions = await this.questionRepository.aggregate([
            { $sort: { [`count.${studyId.studyId}`]: 1 } },
            { $limit: 1 }
        ]).toArray();

        const question = questions.length > 0 ? questions[0] : null;
        if (studyId.studyId > 0 && Object.keys(question.count).length < studyId.studyId) {
            throw new Error('studyId out of range, should be [1, ' + Object.keys(question.count).length + ']');
        }
        question.count[studyId.studyId] = (question.count[studyId.studyId] || 0) + 1;
        this.questionRepository.updateOne({ _id: question._id }, { $set: { count: question.count } });
        return question;
    }

    async createAnswers(answers: Answer): Promise<string>{  
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

        if (! (answers.answerDetail instanceof Array)) {
            answers.answerDetail = [answers.answerDetail];
        }

        const entity = this.answerRepository.create(answers);
        return (await this.answerRepository.save(entity))._id.toString();
    }

    async findAnswersById(id: string): Promise<Answer> {
        return await this.answerRepository.findOneBy({ _id: new ObjectId(id) });
    }

    // async initCount() {
    //     await this.questionModel.updateMany({}, { $set: { count: [0, 0, 0, 0, 0] } });
    //     return null;
    // }

}