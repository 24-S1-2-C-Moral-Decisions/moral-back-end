// more usage, refer to https://github.com/typestack/class-validator?tab=readme-ov-file#usage
import { Type } from 'class-transformer';
import { IsNotEmpty, Max, Min } from 'class-validator';

export class SurveyTypeDto {

    // convert the value to a number
    @Type(() => Number)
    @Max(3)
    @Min(0)
    @IsNotEmpty()
    surveyType: number;
}