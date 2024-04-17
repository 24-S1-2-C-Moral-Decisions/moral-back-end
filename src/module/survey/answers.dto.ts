// more usage, refer to https://github.com/typestack/class-validator?tab=readme-ov-file#usage
import { IsBoolean, IsNotEmpty, IsNumber, Max, Min} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class IndevidualAnswerDto {
    @ApiProperty({
        description: 'Whether user think it is an asshole or not',
        required: true,
        example: 'Whether user think it is an asshole or not'
    })
    @IsNotEmpty()
    @IsBoolean()
    isAsshole: boolean;

    @ApiProperty({
        description: 'Rate the asshole level of the person from 1 to 5',
        required: true,
        enum: [1, 2, 3, 4, 5]
    })
    @IsNumber()
    @Min(1)
    @Max(5)
    @IsNotEmpty()
    rating: number;
}

class GroupAnswerDto extends IndevidualAnswerDto { }

class AnswerDto {
    
    @ApiProperty({
        description: 'The question id',
        required: true,
        example: 'question-id-1'
    })
    @IsNotEmpty()
    questionId: string;

    @ApiProperty({
        description: 'The indevidual answer',
        required: true,
    })
    @IsNotEmpty()
    indevidualAnswer: IndevidualAnswerDto;

    @ApiProperty({
        description: 'The group answer',
        required: true,
    })
    @IsNotEmpty()
    geoupAnswer: GroupAnswerDto;

    @ApiProperty({
        description: 'The comments of the user',
        required: false,
        example: 'This is a comment'
    })
    comments: string;
}

export class AnswersDto {


    @IsNotEmpty()
    @ApiProperty({
        description: 'The prolific id of the user',
        required: true,
        example: 'prolific-id-1'
    })
    prolificId: string;

    @ApiProperty({
        description: 'The study id',
        required: true,
        example: 'study-id-1'
    })
    @IsNotEmpty()
    studyId: string;

    // array of answer
    @ApiProperty({ type: [AnswerDto] })
    @IsNotEmpty()
    answers: AnswerDto[];

    @ApiProperty({
        description: 'The comments of the user',
        required: false,
        example: 'This is a comment'
    })
    comments: string;
}