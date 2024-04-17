import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { SurveyController } from './controller/survey/survey.controller';
import { MongooseModule } from '@nestjs/mongoose';
import * as fs from 'fs';

const envFilePath = '.env/.'+(process.env.NODE_ENV ? process.env.NODE_ENV : 'development')+'.env';
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
  Logger.warn('NODE_ENV is not defined, it should be set to development or production', 'Environment');
}

Logger.log('Loading environment variables from: ' + envFilePath, 'Environment');

// check if the file exists
if (!fs.existsSync(envFilePath)) {
  Logger.error('Environment file not found: ' + envFilePath, '', 'Environment');
}

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath,
  }),
  MongooseModule.forRoot('mongodb://115.146.86.210:27017/testdb')],
  controllers: [AppController, SurveyController],
  providers: [AppService],
})
export class AppModule {}
