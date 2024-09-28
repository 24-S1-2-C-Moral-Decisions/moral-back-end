import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, ObjectId, ObjectIdColumn, PrimaryColumn } from "typeorm"

@Entity("prolifics")
export class Prolific {

    @ObjectIdColumn()
    _id?: ObjectId;

    @ApiProperty({
        description: 'The prolific id',
        required: true,
        example: 'prolific-Xinlong'
    })
    @IsNotEmpty()
    @PrimaryColumn({name: "id"})
    prolificId: string;

    @ApiProperty({
        description: 'The age of the user',
        required: false,
        example: 20
    })
    @Column({nullable: false})
    age: number;

    @ApiProperty({
        description: 'The country of the user',
        required: false,
        example: 'China'
    })
    @Column({nullable: false})
    country: string;

    @ApiProperty({
        description: 'Whether user is a frequent user',
        required: false,
        example: true
    })
    @Column({nullable: false})
    frequentUser: boolean;

    @ApiProperty({
        description: 'The language of the user',
        required: false,
        example: 'English'
    })
    @Column({nullable: false})
    language: string;

    @ApiProperty({
        description: 'Whether user has taken the survey before',
        required: false,
        example: [true, false, false, false, false],
        type: [Boolean]
    })
    @Column("boolean", { array: true, nullable: false })
    takenBefore: boolean[];

    @ApiProperty({
        description: 'Whether user has visited the subreddit before',
        required: false,
        example: true
    })
    @Column({nullable: false})
    visitSubreddit: boolean;
}
