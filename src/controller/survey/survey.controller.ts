import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StudyIdDto } from '../../module/survey/studyId.dto';
import { AnswersDto } from '../../module/survey/answers.dto';
import { QuestionDto } from '../../module/survey/question.dto';


@Controller('survey')
@ApiTags('survey')
export class SurveyController {

    @Get('questions')
    getQuestion(@Query() studyId: StudyIdDto) {
        /**
         * {
         *   id: "survey-id-1",
         *   title: "Survey Title 1",
         *   text: "Survey Question 1"
         * }
         */
        return new QuestionDto({
            id: studyId.studyId,
            title: "Survey Title 1",
            text: "Survey Question 1"
        });
    }

    @Post('answers')
    poetAnswers(@Body() body : AnswersDto) {
        return body.studyId;
    }
}
