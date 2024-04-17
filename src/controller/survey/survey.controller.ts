import { Controller, Get, Query } from '@nestjs/common';
// import { SurveyTypeDto } from '../../module/survey/surveyType.dto';

@Controller('survey')
export class SurveyController {

    @Get('surveyId')
    getSurveyId(@Query() query) {
        return query;
    }

    @Get('questions')
    getQuestion(@Query() param) {
        return param.surveyType;
    }
}
