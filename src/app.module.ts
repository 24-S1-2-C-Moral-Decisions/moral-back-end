import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { Logger } from '@nestjs/common';

if (!process.env.NODE_ENV) {
  Logger.error('NODE_ENV is not defined, it should be set to development or production', 'Environment');
  process.exit(1);
}

let envFilePath = '.env/.'+process.env.NODE_ENV+'.env';
Logger.log('Loading environment variables from: ' + envFilePath, 'Environment');

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath,
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
