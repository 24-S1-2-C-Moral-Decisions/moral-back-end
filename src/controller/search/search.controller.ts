import { Controller, Get, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SearchResultDto } from '../../module/search-result.dto';
import { SearchOptionDto } from '../../module/search-option.dto';

@Controller('search')
@ApiTags('search')
export class SearchController {

    mockData = {
        topic: 'Death',
        id: 'post-1',
        title: 'Death is inevitable',
        content: 'Death is inevitable. We all have to face it.',
        YA: 20,
        NA: 20
    };
    
    @Get()
    @ApiOkResponse({
        description: 'Return a list of search results',
        type: [SearchResultDto]
    })
    @ApiBadRequestResponse({ description: 'Invalid Parameters, Failed to get the question, message is stored in message field' })
    async searchPost(@Query() searchOption: SearchOptionDto){
        const res: SearchResultDto[] = [];
        if (searchOption.keywords !== undefined){
            for (let i = 0; i < 10; i++){
                res.push({...this.mockData, topic:"unknown", id: `post-${i}`, title: `Key: ${searchOption.keywords}`});
            }
        }

        if (searchOption.topic !== undefined){
            res.map((post) => {
                post.topic = searchOption.topic;
            });
        }
        return res;
    }
}
