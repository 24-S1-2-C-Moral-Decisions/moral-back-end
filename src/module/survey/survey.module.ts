import { Module } from '@nestjs/common';
import { SurveyController } from '../../controller/survey/survey.controller';
import { ProlificController } from '../../controller/survey/prolific/prolific.controller';
import { SurveyService } from '../../service/survey.service';
import { ProlificService } from '../../service/prolific/prolific.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prolific } from '../../entity/Prolific';
import { Question } from '../../entity/Question';
import { Answer, AnswerItem } from '../../entity/Answer';

@Module({
    imports: [
        // MongooseModule.forFeature(
        //     [
        //         { name: Question.name, schema: QuestionSchema},
        //         { name: Answers.name, schema: AnswersSchema},
        //         { name: Prolific.name, schema: ProlificSchema},
        //     ],
        //     'survey'
        // ),
        TypeOrmModule.forFeature(
            [
                Question,
                Answer,
                Prolific
            ],
            'survey'
        ),
    ],
    controllers: [SurveyController, ProlificController],
    providers: [SurveyService, ProlificService],
})
export class SurveyModule {}
