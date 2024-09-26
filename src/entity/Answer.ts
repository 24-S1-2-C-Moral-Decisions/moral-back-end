import { Column, Entity, ManyToMany, ManyToOne, ObjectId, ObjectIdColumn } from "typeorm"
import { Prolific } from "./Prolific";
import { Question } from "./Question";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator";

// @Entity('answer_item')
class _AnswerItem {
    // @ObjectIdColumn()
    // _id: ObjectId;

    @ApiProperty({
        description: 'Whether user think it is an asshole or not',
        required: true,
        example: true
    })
    @IsNotEmpty()
    @IsBoolean()
    // @Column({
    //     type: 'boolean',
    //     nullable: false,
    // })
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
//   @Column({
//     type: 'number',
//     nullable: false,
//     enum: [1, 2, 3, 4, 5],
//   })
    rating: number;
}

@Entity('answer_item')
export class AnswerItem {

    @ObjectIdColumn()
    _id?: ObjectId;

    @ApiProperty({
        description: 'The question',
        required: true,
        type: String,
        example: 'atcfwx'
    })
    @IsNotEmpty()
    questionId: string;

    @ApiProperty({
        description: 'The indevidual answer',
        required: true,
        type: _AnswerItem,
    })
    @Column('simple-json', { nullable: true })
    individualAnswer: _AnswerItem;

    @ApiProperty({
        description: 'The group answer',
        required: true,
        type: _AnswerItem,
    })
    @IsNotEmpty()
    @Column('simple-json', { nullable: true })
    groupAnswer: _AnswerItem;

    @ApiProperty({
        description: 'The comments of the user',
        required: false,
        example: 'This is a comment'
    })
    @IsOptional()
    @Column({ type: 'string', nullable: true })
    comment: string;
}

@Entity("answer")
export class Answer {

    @ObjectIdColumn()
    _id: string;

    @IsNotEmpty()
    @ApiProperty({
        description: 'The prolific id of the user',
        required: true,
        example: 'prolific-Xinlong',
        type: String
    })
    @Column({ type: 'string', nullable: false })
    prolificId: string;

    @ApiProperty({
        description: 'The study id',
        required: true,
        example: 1,
        type: 'number'
    })
    @IsNotEmpty()
    @Column({ type: 'number', nullable: false})
    studyId: number;

    @ApiProperty({ type: AnswerItem, isArray: true })
    @IsNotEmpty()
    @Column("simple-array", { nullable: false })
    answerDetail: AnswerItem[];

    @ApiProperty({
        description: 'The comments of the user',
        required: false,
        example: 'This is a comment'
    })
    @IsOptional()
    @Column({ type: 'string', nullable: true })
    comment: string;

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
    @Column('string', { array: true })
    decisionMaking: number[];

    @ApiProperty({
        description: 'List of answers for decision making (15 Items)',
        required: true,
        example: [1,2,3,4,5,
                  1,2,3,4,5,
                  1,2,3,4,5]
    })
    @IsNotEmpty()
    @Column('string', { array: true })
    personalityChoice: number[];

    @ApiProperty({
        description: 'The time stamp taken to complete the survey',
        required: true,
        example: 123456789
    })
    @IsNotEmpty()
    @Column({ type: 'bigint', nullable: false })
    time: number;
}

export const mockAnswer = {
    _id: "66f4d616e7642a3a29ffd25c",
    studyId: 1,
    prolificId: "prolific-Xinlong",
    answerDetail: [
        {
            questionId: "atcfwx",
            individualAnswer: {
                isAsshole: true,
                rating: 1
            },
            groupAnswer: {
                isAsshole: true,
                rating: 1
            },
            comment: "This is a comment",
        }
    ],
    comment: "This is a comment",
    decisionMaking: [
      1, 2, 3, 4, 5,
      1, 2, 3, 4, 5,
      1, 2, 3, 4, 5,
      1, 2, 3, 4, 5,
      1, 2, 3, 4, 5
    ],
    personalityChoice: [
      1, 2, 3, 4, 5,
      1, 2, 3, 4, 5,
      1, 2, 3, 4, 5
    ],
    time: 123456789
};
