import { IsNotEmpty, IsString, Length} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QuestionDto {
    constructor(question: QuestionDto) {
        this.id = question.id;
        this.title = question.title;
        this.selftext = question.selftext;
    }

    @ApiProperty({
        description: 'The question id',
        required: true,
        example: 'atcfwx'
    })
    @IsNotEmpty()
    @IsString()
    @Length(6,6)
    id: string;

    @ApiProperty({
        description: 'The title of the question',
        required: true,
        example: 'Survey Title 1'
    })
    title: string;

    @ApiProperty({
        description: 'The detail of the question',
        required: true,
        example: 'Survey Question 1'
    })
    selftext: string;
}