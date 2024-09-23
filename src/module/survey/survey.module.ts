import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from '../../schemas/question.schemas';
import { Answers, AnswersSchema} from '../../schemas/answers.shcemas';
import { Prolific, ProlificSchema } from '../../schemas/prolific.shcemas';
import { SurveyController } from '../../controller/survey/survey.controller';
import { ProlificController } from '../../controller/survey/prolific/prolific.controller';
import { SurveyService } from '../../service/survey.service';
import { ProlificService } from '../../service/prolific/prolific.service';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
              uri: configService.get<string>('DATABASE_SURVEY_URL'),
            }),
        }),
        MongooseModule.forFeature([
            { name: Question.name, schema: QuestionSchema},
            { name: Answers.name, schema: AnswersSchema},
            { name: Prolific.name, schema: ProlificSchema},
        ]),
    ],
    controllers: [SurveyController, ProlificController],
    providers: [SurveyService, ProlificService],
})
export class SurveyModule {}
