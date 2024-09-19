import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class SearchResultDto {

    @ApiProperty({
        description: 'The topic',
        required: true,
        example: 'Death'
    })
    @IsString()
    @IsNotEmpty()
    topic: string;

    @ApiProperty({
        description: 'The id of the post',
        required: true,
        example: 'post-1'
    })
    @IsString()
    @IsNotEmpty()
    @Length(6,6)
    id: string;
    
    @ApiProperty({
        description: 'The title of the post',
        required: true,
        example: 'Death is inevitable'
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: 'The content of the post',
        required: true,
        example: 'Death is inevitable. We all have to face it.'
    })
    @IsString()
    @IsNotEmpty()
    content: string;

    // @ApiProperty({
    //     description: 'The number of people who think the author is an asshole',
    //     required: true,
    //     example: 20
    // })
    // @IsNotEmpty()
    // @IsNumber()
    // isAsshole: number;

    @ApiProperty({
        description: 'The number of people who think the author is not an asshole',
        required: true,
        example: 20
    })
    @IsNotEmpty()
    @IsNumber()
    YA: number;

    @ApiProperty({
        description: 'The number of people who think the author is not an asshole',
        required: true,
        example: 20
    })
    @IsNotEmpty()
    @IsNumber()
    NA: number;
}
