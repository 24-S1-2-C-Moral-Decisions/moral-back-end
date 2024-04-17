import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnswersDto } from 'src/module/survey/answers.dto';
import { StudyIdDto } from 'src/module/survey/studyId.dto';

@Controller('survey')
@ApiTags('survey')
export class SurveyController {

    @Get('questions')
    getQuestion(@Query() param : StudyIdDto) {
        /**
         * {
         *   id: "survey-id-1",
         *   title: "Survey Title 1",
         *   text: "Survey Question 1"
         * }
         */
        return {
            id: param.studyId,
            title: "Survey Title 1",
            text: "Survey Question 1"
        }
    }

    @Post('answers')
    poetAnswers(@Body() body : AnswersDto) {
        return body.studyId;
    }
}
