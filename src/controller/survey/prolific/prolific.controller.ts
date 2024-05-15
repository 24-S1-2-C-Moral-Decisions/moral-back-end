import { Body, Controller, Get, HttpException, HttpStatus, Logger, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ProlificService } from '../../../service/prolific/prolific.service';
import { ProlificDto } from '../../../module/survey/prolific.dto';

@Controller('prolific')
@ApiTags('survey')
export class ProlificController {
    constructor(private prolificService: ProlificService) {}

    @Post('prolific')
    @ApiCreatedResponse({ description: 'Return created prolific'})
    @ApiBadRequestResponse({ description: 'Invalid Parameters, Failed to create the prolific, message is stored in message field' })
    async postProlific(@Body() body : ProlificDto) {
        // find the prolific by id
        var prolific = await this.prolificService.findProlificById(body.id);
        if (prolific) {
            for (var i = 0; i < body.takenBefore.length; i++) {
                body.takenBefore[i] = body.takenBefore[i] || prolific.takenBefore[i];
            }
        }
        // console.log(body);
        return await this.prolificService.createOrUpdate(body).then((res) => {
            return res;
        }).catch((err) => {
            Logger.debug(err);
            throw new HttpException("Failed to save the prolific: " + err, HttpStatus.BAD_REQUEST);
        });
    }

    @Get('prolific')
    @ApiCreatedResponse({ description: 'Return coresponing prolific'})
    async findProlificById(@Query() prolific : ProlificDto) {
        return await this.prolificService.findProlificById(prolific.id).then((res) => {
            return res;
        });
    }
}
