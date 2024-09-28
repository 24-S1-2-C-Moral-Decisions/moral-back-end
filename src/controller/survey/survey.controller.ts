import {Body, Controller, Get, HttpException, HttpStatus, Logger, Post, Query} from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { StudyIdDto } from '../../module/survey/studyId.dto';
import { SurveyService } from '../..//service/survey.service';
import { Question } from '../../entity/Question';
import { Answer } from '../../entity/Answer';


@Controller('survey')
@ApiTags('survey')
export class SurveyController {
    constructor(private surveyService: SurveyService) {}

    @Get('question')
    @ApiOkResponse({ description: 'Return a question' })
    @ApiBadRequestResponse({ description: 'Invalid Parameters, Failed to get the question, message is stored in message field' })
    async getQuestion(@Query() studyId: StudyIdDto): Promise<Question>{
        /**
         * {
         *   _id: "survey-id-1",
         *   title: "Survey Title 1",
         *   text: "Survey Question 1"
         *   count
         *   studyId
         * }
         */

        // console.log('Validated studyId:', studyId);

        return this.surveyService.findQuestion(studyId).then((question) => {
            return question;
        }).catch((err) => {
            Logger.debug(err);
            throw new HttpException("Failed to get the question: " + err, HttpStatus.BAD_REQUEST);
        });
    }
    
    @Post('answer')
    @ApiCreatedResponse({ description: 'Return the answer id has been created' })
    @ApiBadRequestResponse({ description: 'Invalid Parameters, Failed to get the question, message is stored in message field' })
    async postAnswers(@Body() body : Answer) {
        return this.surveyService.createAnswers(body).then((id) => {
            return id;
        }).catch((err) => {
            Logger.debug(err);
            throw new HttpException("Failed to save the answers: " + err, HttpStatus.BAD_REQUEST);
        });
    }

    @Get('answer')
    @ApiQuery({
        name: 'answerId',
        required: true,
        description: 'The ID of the answer you want to retrieve',
        example: '66f4cc713d9f96013d0b4516',  // 这里提供一个示例 ID
    })
    @ApiCreatedResponse({ description: 'Find the answer by id' })
    @ApiBadRequestResponse({ description: 'Invalid Parameters, Failed to get the question, message is stored in message field' })
    async getAnswersById(@Query() body: {answerId: string}) {
        return this.surveyService.findAnswersById(body.answerId).then((answers) => {
            return answers;
        }).catch((err) => {
            Logger.debug(err);
            throw new HttpException("Failed to get the answers: " + err, HttpStatus.BAD_REQUEST);
        });
    }

    // @Patch('init_count')
    // initCount(){
    //     this.surveyService.initCount();
    // }
}
