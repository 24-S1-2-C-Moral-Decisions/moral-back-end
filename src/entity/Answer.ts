import { Column, Entity, ManyToMany, ManyToOne, ObjectId, ObjectIdColumn } from "typeorm"
import { Prolific } from "./Prolific";
import { Question } from "./Question";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator";

// @Entity('answer_item')
class _AnswerItem {
    @ApiProperty({
        description: 'Whether user think it is an asshole or not',
        required: true,
        example: true
    })
    @IsNotEmpty()
    @IsBoolean()
    // @ObjectIdColumn()
    // _id: ObjectId;

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

// this class is only for swagger documentation
class _QuestionType{
    @ApiProperty({
        description: 'The question',
        required: true,
        example: 'atcfwx'
    })
    @IsNotEmpty()
    _id: string;
}

@Entity('answer_item')
export class AnswerItem {

    @ObjectIdColumn()
    _id: ObjectId;

    @ApiProperty({
        description: 'The question',
        required: true,
        type: _QuestionType,
    })
    @IsNotEmpty()
    @ManyToMany(() => Question, { nullable: false })
    question: Question;

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

// this class is only for swagger documentation
class _ProlificType{
    @ApiProperty({
        description: 'The prolific id',
        required: true,
        example: 'prolific-Xinlong'
    })
    @IsNotEmpty()
    prolificId: string;
}

@Entity("answer")
export class Answer {

    @ObjectIdColumn()
    _id: ObjectId;

    @IsNotEmpty()
    @ApiProperty({
        description: 'The prolific id of the user',
        required: true,
        type: _ProlificType
    })
    @ManyToOne(() => Prolific, { nullable: false })
    prolific: Prolific;

    @ApiProperty({
        description: 'The study id',
        required: true,
        example: 1,
        type: 'number'
    })
    @IsNotEmpty()
    @Column({ type: 'number', nullable: false})
    studyId: number;

    @ApiProperty({ type: AnswerItem })
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
