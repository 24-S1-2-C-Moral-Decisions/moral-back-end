// more usage, refer to https://github.com/typestack/class-validator?tab=readme-ov-file#usage
import { Type } from 'class-transformer';
import { IsNotEmpty, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SurveyTypeDto {

    @ApiProperty({
        description: 'The type of the survey',
        required: true,
        enum: [1, 2, 3, 4]
    })
    // convert the value to a number
    @Type(() => Number)
    @Max(4)
    @Min(1)
    @IsNotEmpty()
    surveyType: number;
}