import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from '../../schemas/question.schemas';
import { Answers, AnswersSchema} from '../../schemas/answers.shcemas';
import { SurveyController } from '../../controller/survey/survey.controller';
import { ProlificController } from '../../controller/survey/prolific/prolific.controller';
import { SurveyService } from '../../service/survey.service';
import { ProlificService } from '../../service/prolific/prolific.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prolific } from '../../entity/Prolific';

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
                // Question,
                // Answers,
                Prolific
            ],
            'survey'
        ),
    ],
    controllers: [SurveyController, ProlificController],
    providers: [SurveyService, ProlificService],
})
export class SurveyModule {}
