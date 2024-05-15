import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Prolific {
  @Prop({
    unique: true,
    required: true,
    type: String
  })
  id: string;

  @Prop({
    required: true,
    type: [Boolean],
    length: 5
  })
  takenBefore: boolean[];

  @Prop({
    required: false,
    type: String
  })
  country: string;

  @Prop({
    required: false,
    type: Number,
    max: 100,
    min: 0
  })
  age: number;

  @Prop({
    required: false,
    type: String
  })
  language: string;

  @Prop({
    required: false,
    type: Boolean
  })
  frequentUser: boolean;

  @Prop({
    required: false,
    type: Boolean
  })
  visitSubreddit: boolean;
}
export const ProlificSchema = SchemaFactory.createForClass(Prolific);
export type ProlificDocument = HydratedDocument<Prolific>;
