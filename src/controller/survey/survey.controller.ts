import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StudyIdDto } from '../../module/survey/studyId.dto';
import { AnswersDto } from '../../module/survey/answers.dto';
import { SurveyService } from '../../service/survey.service';


@Controller('survey')
@ApiTags('survey')
export class SurveyController {
    constructor(private surveyService: SurveyService) {}

    @Get('questions')
    getQuestion(@Query() studyId: StudyIdDto) {
        /**
         * {
         *   _id: "survey-id-1",
         *   title: "Survey Title 1",
         *   text: "Survey Question 1"
         *   count
         *   studyId
         * }
         */
        return this.surveyService.findQuestions(studyId)
    }
    
    @Post('answers')
    poetAnswers(@Body() body : AnswersDto) {
        this.surveyService.createAnswers(body);
        return "answer saved";
    }
}
