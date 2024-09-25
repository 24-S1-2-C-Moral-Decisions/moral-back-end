import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { RateLimiterMiddleware } from './rate-limiter.middleware';
import { SurveyModule } from './module/survey/survey.module';
import { PostsModule } from './module/posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';

const envFilePath = '.env/.env'+'.'+(process.env.NODE_ENV == 'development' ? 'development' : 'production');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath : [envFilePath, '.env/.env'],
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
        TFIDF_WORKER_NUM: Joi.number().required(),
        DEFAULT_CACHE_TTL: Joi.number().required(),
      }),
    }),
    MongooseModule.forRoot(
      process.env.DATABASE_URL, 
      {
        dbName: 'posts',
        connectionName: 'posts',
      }
    ),
    MongooseModule.forRoot(
      process.env.DATABASE_URL, 
      {
        dbName: 'survey',
        connectionName: 'survey',
      }
    ),
    MongooseModule.forRoot(
      process.env.DATABASE_URL, 
      {
        dbName: 'cache',
        connectionName: 'cache',
      }
    ),
    SurveyModule,
    PostsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimiterMiddleware).forRoutes('/survey/answer');
  }
}
