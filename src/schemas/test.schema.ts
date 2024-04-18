import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type TestTypeDocument = HydratedDocument<TestType>;

@Schema()
export class TestType {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  updatedAt: string;
}

export const TestSchema = SchemaFactory.createForClass(TestType);