import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

type Topic = {
    topic: string;
    relevance: number;
}

type PostDocDtoType = {
    _id: string;
    verdict: string;
    title: string;
    topic_1: string;
    topic_1_p: number;
    topic_2: string;
    topic_2_p: number;
    topic_3: string;
    topic_3_p: number;
    topic_4: string;
    topic_4_p: number;
    num_comments: number;
    resolved_verdict: string;
    selftext: string;
};

export class PostDocDto {

    constructor(data: PostDocDtoType){
        this.id = data._id;
        this.verdict = data.verdict;
        this.title = data.title;
        this.topics = [
            {topic: data.topic_1, relevance: data.topic_1_p},
            {topic: data.topic_2, relevance: data.topic_2_p},
            {topic: data.topic_3, relevance: data.topic_3_p}
        ];
        this.num_comments = data.num_comments;
        this.resolved_verdict = data.resolved_verdict;
        this.selftext = data.selftext;
    }

    @ApiProperty({
        description: 'Post id',
        type: String,
        required: true,
        example: '240zna'
    })
    @IsString()
    @IsNotEmpty()
    id: string;
    
    @ApiProperty({
        description: 'The verdict of the post',
        type: String,
        required: true,
        example: 'INFO'
    })
    @IsString()
    @IsNotEmpty()
    verdict: string;
    
    @ApiProperty({
        description: 'The title of the post',
        type: String,
        required: true,
        example: 'AITA for not wanting to go to my friend\'s wedding?'
    })
    @IsString()
    @IsNotEmpty()
    title: string;
    
    @ApiProperty({
        description: 'The topics of the post',
        required: true,
        example: [
            {topic: 'friendship', relevance: 0.8},
            {topic: 'wedding', relevance: 0.6},
            {topic: 'relationship', relevance: 0.4},
            {topic: 'family', relevance: 0.2}
        ]
    })
    @IsNotEmpty()
    @Length(4, 4)
    topics: Topic[];
    
    @ApiProperty({
        description: 'The number of comments of the post',
        type: Number,
        required: true,
        example: 100
    })
    @IsNotEmpty()
    @IsNumber()
    num_comments: number;
    
    @ApiProperty({
        description: 'The resolved verdict of the post',
        type: String,
        required: false,
        example: 'YTA'
    })
    @IsNotEmpty()
    @IsString()
    resolved_verdict: string;
    
    @ApiProperty({
        description: 'The selftext of the post',
        type: String,
        required: false,
        example: "I'm a 25 year"
    })
    @IsNotEmpty()
    @IsString()
    selftext: string;

    isRelevantTopic?(topic: string): boolean{
        if (topic === 'all') return true;
        return this.topics.some((t) => t.topic === topic);
    }
}
