import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class SearchOptionDto {
    @ApiProperty({
        description: 'The topic',
        required: false,
        example: 'Death'
    })
    @IsString()
    @IsOptional()
    topic?: string;

    @ApiProperty({
        description: 'The keywords',
        required: false,
        example: 'Death Life Afterlife'
    })
    @IsString()
    @IsOptional()
    keywords?: string;
}
