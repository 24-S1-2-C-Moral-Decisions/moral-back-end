// more usage, refer to https://github.com/typestack/class-validator?tab=readme-ov-file#usage
import { IsBoolean, IsNotEmpty, IsNumber, IsString, Length, Max, Min} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StudyIdDto } from './studyId.dto';

class IndividualAnswerDto {
    @ApiProperty({
        description: 'Whether user think it is an asshole or not',
        required: true,
        example: true
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

class GroupAnswerDto extends IndividualAnswerDto { }

class AnswerDto {
    
    @ApiProperty({
        description: 'The question id',
        required: true,
        example: 'atcfwx'
    })
    @IsNotEmpty()
    @Length(6,6)
    questionId: string;

    @ApiProperty({
        description: 'The indevidual answer',
        required: true,
    })
    @IsNotEmpty()
    individualAnswer: IndividualAnswerDto;

    @ApiProperty({
        description: 'The group answer',
        required: true,
    })
    @IsNotEmpty()
    groupAnswer: GroupAnswerDto;

    @ApiProperty({
        description: 'The comments of the user',
        required: false,
        example: 'This is a comment'
    })
    comments?: string;
}

export class AnswerIdDto {
    constructor(id: string) {
        this.id = id;
    }

    @ApiProperty({
        description: 'The unique id of the answer',
        required: false,
        example: '60f7c72b8f3f5e001f8c84b4'
    })
    @IsString()
    @IsNotEmpty()
    id: string;

    toString(): string {
        return this.id.toString();
    }
}

export class AnswersDto {
    constructor(answers: AnswersDto) {
        this.id = answers.id;
        this.prolificId = answers.prolificId;
        this.studyId = answers.studyId;
        this.answer = answers.answer;
        this.comments = answers.comments;
        this.time = answers.time;

        this.decisionMaking = answers.decisionMaking;
        this.personalityChoice = answers.personalityChoice;

        this.changedJudjement = this.answer.individualAnswer.isAsshole === this.answer.groupAnswer.isAsshole;
        this.changedConfidence = this.answer.individualAnswer.rating === this.answer.groupAnswer.rating;
    }

    @ApiProperty({
        description: 'The unique id of the answer',
        required: false,
        example: '60f7c72b8f3f5e001f8c84b4'
    })
    @IsString()
    id?: AnswerIdDto;

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
        example: 1,
        type: StudyIdDto
    })
    @IsNotEmpty()
    studyId: StudyIdDto;

    // array of answer
    @ApiProperty({ type: AnswerDto })
    @IsNotEmpty()
    answer: AnswerDto;

    @ApiProperty({
        description: 'Whether the user changed their judgement',
        required: false,
    })
    changedJudjement?: boolean;

    @ApiProperty({
        description: 'Whether the user changed their confidence',
        required: false,
    })
    changedConfidence?: boolean;

    @ApiProperty({
        description: 'The comments of the user',
        required: false,
        example: 'This is a comment'
    })
    comments?: string;

    @ApiProperty({
        description: 'List of answers for decision making (25 Items)',
        required: true,
        example: [1,2,3,4,5,
                  1,2,3,4,5,
                  1,2,3,4,5,
                  1,2,3,4,5,
                  1,2,3,4,5]
    })
    @IsNotEmpty()
    decisionMaking: number[];

    @ApiProperty({
        description: 'List of answers for decision making (15 Items)',
        required: true,
        example: [1,2,3,4,5,
                  1,2,3,4,5,
                  1,2,3,4,5]
    })
    @IsNotEmpty()
    personalityChoice: number[];

    @ApiProperty({
        description: 'The time stamp taken to complete the survey',
        required: true,
        example: 123456789
    })
    @IsNotEmpty()
    time: number;
}

