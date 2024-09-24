import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiServiceUnavailableResponse, ApiTags } from '@nestjs/swagger';
import { SearchOptionDto } from '../../module/search-option.dto';
import { PostDocDto } from '../../module/posts/post.dto';
import { SearchService, TfIdfBuildingException } from '../../service/search/search.service';
import { PostService } from '../../service/post/post.service';

@Controller('search')
@ApiTags('search')
export class SearchController {

    constructor(
        private searchService: SearchService,
        private postService: PostService
    ) {}

    mockData:PostDocDto = {
        id: '1',
        title: 'title',
        verdict: 'INFO',
        topics: [
            {topic: 'topic1', relevance: 0.5},
            {topic: 'topic2', relevance: 0.3},
            {topic: 'topic3', relevance: 0.2}
        ],
        num_comments: 10,
        resolved_verdict: 'INFO',
        selftext: 'selftext'
    };
    
    @Get()
    @ApiOkResponse({
        description: 'Return a list of search results',
        type: [PostDocDto],
    })
    @ApiBadRequestResponse({ description: 'Invalid Parameters, Failed to get the question, message is stored in message field' })
    @ApiServiceUnavailableResponse({ description: 'Server is rebuilding searching cache, please waiting' })
    async searchPost(@Query() searchOption: SearchOptionDto){
        let res: PostDocDto[] = [];
        try {
            if (searchOption.keywords !== undefined){
                res = await this.searchService.search(searchOption.topic, searchOption.keywords, searchOption.limit);
            }
            else if (searchOption.topic !== undefined){
                if (searchOption.keywords === undefined){
                    res = await this.postService.getPostsByTopic(searchOption.topic, searchOption.limit);
                }
                else {
                    res = await this.searchService.search(searchOption.topic, searchOption.keywords, searchOption.limit);
                }
            }
        }
        catch (e) {
            if (e instanceof TfIdfBuildingException) {
                throw new HttpException(
                    {
                    status: HttpStatus.SERVICE_UNAVAILABLE,
                    error: e.message,
                    },
                    HttpStatus.SERVICE_UNAVAILABLE,
                );
            }
            else
                throw e;
        }
        
        return res;
    }
}