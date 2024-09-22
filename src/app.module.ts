import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import * as Joi from '@hapi/joi';
import { SurveyController } from './controller/survey/survey.controller';
import { MongooseModule } from '@nestjs/mongoose';
import * as fs from 'fs';
import { SurveyService } from './service/survey.service';
import { Question, QuestionSchema } from './schemas/question.schemas';
import { Answer, AnswerSchema, Answers, AnswersSchema, IndividualAnswer, IndividualAnswerSchema } from './schemas/answers.shcemas';
import { RateLimiterMiddleware } from './rate-limiter.middleware';
import { ProlificService } from './service/prolific/prolific.service';
import { ProlificController } from './controller/survey/prolific/prolific.controller';
import { Prolific, ProlificSchema } from './schemas/prolific.shcemas';
import { SearchController } from './controller/search/search.controller';

const envFilePath = '.env/.env'+'.'+(process.env.NODE_ENV == 'development' ? 'development' : 'production');

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath : [envFilePath, '.env/.env'],
    validationSchema: Joi.object({
      BACKEND_PORT: Joi.number().default(3000),
    }),
  }),
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      uri: configService.get<string>('DATABASE_CONN_STRING'),
    }),
  }),
  MongooseModule.forFeature([
    { name: Question.name, schema: QuestionSchema },
    { name: IndividualAnswer.name, schema: IndividualAnswerSchema },
    { name: Answer.name, schema: AnswerSchema },
    { name: Answers.name, schema: AnswersSchema },
    { name: Prolific.name, schema: ProlificSchema }])],
  controllers: [AppController, SurveyController, ProlificController, SearchController],
  providers: [AppService,SurveyService, ProlificService],
})
export class AppModule implements NestModule {
  private readonly logger = new Logger(AppModule.name);
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimiterMiddleware).forRoutes('/survey/answer'); // 对所有路由生效
  }

  onModuleInit() {
    const requiredEnvVars = ['DATABASE_CONN_STRING', 'BACKEND_PORT'];

    requiredEnvVars.forEach((envVar) => {
      const value = this.configService.get<string>(envVar);
      if (!value) {
        this.logger.error('DATABASE_CONN_STRING is not defined', '', 'Environment');
        throw new Error(`Environment variable ${envVar} is not set`);
      }
    });
  }
}
