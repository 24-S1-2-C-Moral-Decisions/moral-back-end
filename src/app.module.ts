import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { RateLimiterMiddleware } from './rate-limiter.middleware';
import { SurveyModule } from './module/survey/survey.module';
import { PostsModule } from './module/posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prolific } from './entity/Prolific';
import { Question } from './entity/Question';
import { Answer } from './entity/Answer';
import { MoralCache } from './entity/Cache';

const envFilePath = '.env/.env'+'.'+(process.env.NODE_ENV == 'development' ? 'development' : 'production');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath : [envFilePath, '.env/.env'],
      validationSchema: Joi.object({
        BACKEND_PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
        TFIDF_WORKER_NUM: Joi.number().required(),
        DEFAULT_CACHE_TTL: Joi.number().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.DATABASE_URL,
      database: 'survey',
      name: 'survey',
      entities: [Prolific, Question, Answer],
      retryAttempts: 5,
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.DATABASE_URL,
      database: 'posts',
      name: 'posts',
      entities: [],
      retryAttempts: 5,
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.DATABASE_URL,
      database: 'cache',
      name: 'cache',
      entities: [MoralCache],
      retryAttempts: 5,
    }),
    SurveyModule,
    // PostsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimiterMiddleware).forRoutes('/survey/answer');
  }
}
