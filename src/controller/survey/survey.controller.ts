import { Controller, Get, Param } from '@nestjs/common';
import { SurveyTypeDto } from '../../DTO/surveyType.dto';

@Controller('survey')
export class SurveyController {

    @Get('surveyId')
    getSurveyId(@Param() param: SurveyTypeDto) {
        return param.surveyType;
    }
}
