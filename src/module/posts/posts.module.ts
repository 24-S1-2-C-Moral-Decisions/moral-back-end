import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchController } from '../../controller/search/search.controller';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
              uri: configService.get<string>('DATABASE_POST_URL'),
            }),
        }),
        MongooseModule.forFeature([
            // { name: Question.name, schema: QuestionSchema}
        ]),
    ],
    controllers: [SearchController],
    providers: [],
})
export class PostsModule {}
