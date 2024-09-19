// more usage, refer to https://github.com/typestack/class-validator?tab=readme-ov-file#usage
import {IsIn, IsNotEmpty} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Type} from "class-transformer";

export class StudyIdDto {

    constructor(studyId: number) {
        this.studyId = studyId;
    }

    @ApiProperty({
        description: 'The study id',
        required: true,
        // enum: [1, 2, 3, 4, 5]
    })
    @Type(() => Number)
    @IsNotEmpty()
    @IsIn([1, 2, 3, 4, 5], { message: 'studyId must be one of the following values: 1, 2, 3, 4, 5' })
    studyId: number;

}