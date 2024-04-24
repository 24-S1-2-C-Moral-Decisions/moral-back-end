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

    async findQuestion(studyId: StudyIdDto) {
        // uncertainty
        if (studyId.studyId === "2") {
            const question = await this.questionModel.findOne().sort({ "count.2": 1 }).limit(1);
            question.count[2] += 1;
            await question.save();
            const {_id,title,selftext,YA_group,NA_group,YA_percentage,NA_percentage,very_certain_YA,very_certain_NA}=question;
            return {_id,title,selftext,YA_group,NA_group,YA_percentage,NA_percentage,very_certain_YA,very_certain_NA};
        } else {
            // others
        }

    }

    async createAnswers(answers: AnswersDto): Promise<Answers> {
        const createAnswers = new this.answersModel(answers);
        return createAnswers.save();
    }

    async initCount() {
        await this.questionModel.updateMany({}, { $set: { count: [0, 0, 0, 0, 0] } });
        return null;
    }

}