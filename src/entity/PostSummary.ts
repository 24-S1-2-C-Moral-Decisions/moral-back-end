import { Column, Entity, PrimaryColumn } from "typeorm";
import { PostSummaryCollectionName } from "../utils/ConstantValue";


@Entity(PostSummaryCollectionName)
export class PostSummary {

    @PrimaryColumn()
    id: string;

    @Column()
    title: string;

    @Column()
    verdict: string;
    
    @Column()
    YTA: number;
    
    @Column()
    NTA: number;
    
    @Column()
    selftext: string;

    @Column("string", { array: true })
    topics: string[];
}
