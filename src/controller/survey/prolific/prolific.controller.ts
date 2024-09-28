import { Body, Controller, Get, HttpException, HttpStatus, Logger, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProlificService } from '../../../service/prolific/prolific.service';
import { Prolific } from '../../../entity/Prolific';

@Controller('survey/prolific')
@ApiTags('survey')
export class ProlificController {
    constructor(private prolificService: ProlificService) {}

    @Post()
    @ApiCreatedResponse({ description: 'Return created prolific'})
    @ApiBadRequestResponse({ description: 'Invalid Parameters, Failed to create the prolific, message is stored in message field' })
    async postProlific(@Body() body : Prolific) {
        // find the prolific by id
        const prolific = await this.prolificService.findProlificById(body.prolificId);
        if (prolific) {
            for (let i = 0; i < body.takenBefore?.length; i++) {
                body.takenBefore[i] = body.takenBefore[i] || prolific.takenBefore[i];
            }
        }
        // console.log(body);
        return this.prolificService.createOrUpdate(body.prolificId, body).then((res) => {
            return res;
        }).catch((err) => {
            Logger.debug(err);
            throw new HttpException("Failed to save the prolific: " + err, HttpStatus.BAD_REQUEST);
        });
    }

    @Get()
    @ApiQuery({
        name: 'prolificId',
        required: true,
        description: 'The ID of the prolific you want to retrieve',
        example: 'prolific-Xinlong'
    })
    @ApiCreatedResponse({ description: 'Return coresponing prolific'})
    async findProlificById(@Query() body : {prolificId: string}) {
        return this.prolificService.findProlificById(body.prolificId).then((res) => {
            return res;
        });
    }
}
