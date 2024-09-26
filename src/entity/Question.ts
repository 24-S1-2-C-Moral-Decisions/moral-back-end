import {Column, Entity, PrimaryColumn } from "typeorm"

@Entity('posts')
export class Question {
    // @PrimaryColumn()
    // @ObjectIdColumn()
    // id: string;

    @PrimaryColumn()
    _id: string;

    @Column({nullable: false})
    title: string;

    @Column({nullable: false})
    selftext: string;

    @Column({type:'double', nullable: false})
    very_certain_YA: number;

    @Column({type:'double', nullable: false})
    very_certain_NA: number;

    @Column({type:'double', nullable: false})
    YA_percentage: number;

    @Column({type:'double', nullable: false})
    NA_percentage: number;

    @Column("string", { array: true, nullable: false })
    original_post_YA_top_reasonings: string[];

    @Column("string", { array: true, nullable: false })
    original_post_NA_top_reasonings: string[];

    @Column("number", { array: true, nullable: false })
    count: number[];
}

export const mockQuestion: Question = {
    _id: "atcfwx",
    title: "AITA for asking my sister to dye her hair a “normal” color?",
    selftext:
      "I’m getting married, beautiful white dress and venue. Expensive photos. Everything I wish for, but...My sister (who is in my bridal party) has BRIGHT blue hair. I don’t want that to be where people’s eyes go when they are at my ceremony nor in all of my photos. I’m spending so much time and money on a beautiful neutral colored ceremony, she would stick out like a rose in a desert. Thanks for your thoughts.",
    very_certain_YA: 0.853658536585366,
    very_certain_NA: 0.264705882352941,
    YA_percentage: 0.55952380952381,
    NA_percentage: 0.440476190476191,
    original_post_YA_top_reasonings: [
      "YAC'mon OP, don't be *that* bride.",
      "YA. Your sisters hair is part of who she is and asking her to change part of who she is for one day is a dick move. ",
      "YA. Your sister isn't taking anything away from you by having colorful hair. People aren't going to be so obsessed with the color that they don't see you. ",
    ],
    original_post_NA_top_reasonings: [
      "NA.  Can you have the photos photoshopped instead?  May be easier than this drama.  ",
      "NA you are not the asshole for asking, as long as you can graciously accept a “no, I don’t want to” as an answer. ",
      "NA - If you've asked and she said yes, don't feel bad. If you still feel guilty though, maybe offer to pay for her to get her hair done a different color?",
    ],
    count: [0, 1, 0, 0, 0]
  };
  
