import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { Logger } from '@nestjs/common';
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

const envFilePath = '.env/.'+(process.env.NODE_ENV ? process.env.NODE_ENV : 'development')+'.env';
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
  Logger.warn('NODE_ENV is not defined, it should be set to development or production', 'Environment');
}

Logger.log('Loading environment variables from: ' + envFilePath, 'Environment');

// check if the file exists
if (!fs.existsSync(envFilePath)) {
  Logger.warn('Environment file not found: ' + envFilePath, '', 'Environment');
  // check whether PORT is defined
  if (!process.env.PORT) {
    Logger.error('PORT is not defined', 'Environment');
    process.exit(1);
  }
}

// check database configuration
// configuration will be stored in the ./env/.database.env file by default
if (!fs.existsSync('.env/.database.env')) {
  Logger.warn('Database configuration file not found: .env/.database.env', 'Environment');
  // check whether the DATABASE_CONN_STRING is defined
  if (!process.env.DATABASE_CONN_STRING) {
    Logger.error('DATABASE_CONN_STRING is not defined', '', 'Environment');
    process.exit(1);
  }
}
else {
  Logger.log('Database configuration file found: .env/.database.env', 'Environment');
}

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath : [envFilePath, '.env/.database.env'],
  }),
  MongooseModule.forRoot(process.env.DATABASE_CONN_STRING),
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
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimiterMiddleware).forRoutes('/survey/answer'); // 对所有路由生效
  }
}
