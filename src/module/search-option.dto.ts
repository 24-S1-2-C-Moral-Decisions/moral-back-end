import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

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

    @ApiProperty({
        description: 'The limit of the search',
        required: false,
        example: 10
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    pageSize?: number = 10;

    @ApiProperty({
        description: 'The page of the search',
        required: false,
        example: 0
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    page?: number = 0;
}
