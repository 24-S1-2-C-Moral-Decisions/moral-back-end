import { Column, Entity, PrimaryColumn } from "typeorm"
import { AllCollectionName } from "../utils/ConstantValue";

@Entity(AllCollectionName)
export class PostMateData {
    @PrimaryColumn()
    _id: string;

    @Column({ type: 'int' })
    year: number;

    @Column({ type: 'int' })
    month: number;

    @Column({ type: 'int' })
    day: number;

    @Column({ type: 'string'})
    verdict: string;

    @Column({ type: 'int' })
    num_words: number;

    @Column({ type: 'double' })
    label_entropy: number;

    @Column({ type: 'int' })
    score: number;

    @Column({ type: 'int' })
    YTA: number;

    @Column({ type: 'int' })
    NTA: number;

    @Column({ type: 'int' })
    ESH: number;

    @Column({ type: 'int' })
    NAH: number;

    @Column({ type: 'int' })
    INFO: number;

    @Column({ type: 'string' })
    title: string;

    @Column({ type: 'string' })
    topic_1: string;

    @Column({ type: 'double' })
    topic_1_p: number;

    @Column({ type: 'string' })
    topic_2: string;

    @Column({ type: 'double' })
    topic_2_p: number;

    @Column({ type: 'string' })
    topic_3: string;

    @Column({ type: 'double' })
    topic_3_p: number;

    @Column({ type: 'string' })
    topic_4: string;

    @Column({ type: 'int' })
    year_r: number;

    @Column({ type: 'int' })
    month_r: number;

    @Column({ type: 'int' })
    day_r: number;

    @Column({ type: 'int' })
    hour: number;

    @Column({ type: 'int' })
    minute: number;

    @Column({ type: 'int' })
    second: number;

    @Column({ type: 'int' })
    num_words_r: number;

    @Column({ type: 'int' })
    num_comments: number;

    @Column({ type: 'int' })
    score_r: number;

    @Column({ type: 'string' })
    flair: string;

    @Column({ type: 'string' })
    verdict_r: string;

    @Column({ type: 'string' })
    resolved_verdict: string;

    @Column({ type: 'string' })
    v_id: string;

    @Column({ type: 'int' })
    v_year: number;

    @Column({ type: 'int' })
    v_month: number;

    @Column({ type: 'int' })
    v_day: number;

    @Column({ type: 'int' })
    v_hour: number;

    @Column({ type: 'int' })
    v_minute: number;

    @Column({ type: 'int' })
    v_second: number;

    @Column({ type: 'int' })
    v_words: number;

    @Column({ type: 'int' })
    v_score: number;

}
