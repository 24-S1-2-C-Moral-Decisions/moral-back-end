// more usage, refer to https://github.com/typestack/class-validator?tab=readme-ov-file#usage
import { ApiProperty } from '@nestjs/swagger';

export class ProlificDto {

    @ApiProperty({
        description: 'The prolific id',
        required: true,
        example: 'prolific-Xinlong'
    })
    id: string;

    @ApiProperty({
        description: 'Whether user has taken the survey before',
        required: false,
        example: [true, false, false, false, false]
    })
    takenBefore: boolean[];

    @ApiProperty({
        description: 'The country of the user',
        required: false,
        example: 'China'
    })
    country: string;

    @ApiProperty({
        description: 'The age of the user',
        required: false,
        example: 20
    })
    age: number;

    @ApiProperty({
        description: 'The language of the user',
        required: false,
        example: 'English'
    })
    language: string;

    @ApiProperty({
        description: 'Whether user is a frequent user',
        required: false,
        example: true
    })
    frequentUser: boolean;

    @ApiProperty({
        description: 'Whether user has visited the subreddit before',
        required: false,
        example: true
    })
    visitSubreddit: boolean;
}