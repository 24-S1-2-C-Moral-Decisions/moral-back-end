import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import * as Joi from '@hapi/joi';
import { RateLimiterMiddleware } from './rate-limiter.middleware';
import { SurveyModule } from './module/survey/survey.module';
import { PostsModule } from './module/posts/posts.module';

const envFilePath = '.env/.env'+'.'+(process.env.NODE_ENV == 'development' ? 'development' : 'production');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath : [envFilePath, '.env/.env'],
      validationSchema: Joi.object({
        BACKEND_PORT: Joi.number().default(3000),
        DATABASE_SURVEY_URL: Joi.string().required(),
        DATABASE_POST_URL: Joi.string().required(),
      }),
    }),
    SurveyModule,
    PostsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  private readonly logger = new Logger(AppModule.name);
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimiterMiddleware).forRoutes('/survey/answer');
  }
}
