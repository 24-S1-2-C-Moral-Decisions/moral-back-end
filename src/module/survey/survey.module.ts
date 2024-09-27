import { Module } from '@nestjs/common';
import { SurveyController } from '../../controller/survey/survey.controller';
import { ProlificController } from '../../controller/survey/prolific/prolific.controller';
import { SurveyService } from '../../service/survey.service';
import { ProlificService } from '../../service/prolific/prolific.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prolific } from '../../entity/Prolific';
import { Question } from '../../entity/Question';
import { Answer } from '../../entity/Answer';
import { SurveyConnectionName } from '../../utils/ConstantValue';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
                Question,
                Answer,
                Prolific
            ],
            SurveyConnectionName
        ),
    ],
    controllers: [SurveyController, ProlificController],
    providers: [SurveyService, ProlificService],
})
export class SurveyModule {}
