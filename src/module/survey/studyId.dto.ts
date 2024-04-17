// more usage, refer to https://github.com/typestack/class-validator?tab=readme-ov-file#usage
import { IsNotEmpty} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StudyIdDto {

    @ApiProperty({
        description: 'The study id',
        required: true,
        // enum: [1, 2, 3, 4]
    })
    @IsNotEmpty()
    studyId: string;
}