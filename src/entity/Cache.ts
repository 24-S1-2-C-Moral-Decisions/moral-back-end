import { ObjectId } from "mongodb";
import { Column, Entity, ObjectIdColumn, PrimaryColumn } from "typeorm"

@Entity()
export class MoralCache {
    @ObjectIdColumn()
    _id: ObjectId;

    @PrimaryColumn('string')
    key: string;

    @Column()
    value: string;

    @Column()
    expiresAt: Date;
}

export const expectCache = [
    {
        key: 'invalidCache',
        value: JSON.stringify({ value: 'value' }),
        expiresAt: new Date("2021-09-01")
    },
    {
        key: 'validCache',
        value: JSON.stringify({ value: 'value' }),
        expiresAt: new Date(new Date().getTime() + 60*60*24*30*1000) // 30 days
    }
]
