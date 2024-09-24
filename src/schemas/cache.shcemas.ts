import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class MoralCache {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({
    required: true,
    type: String
  })
  value: string;

  @Prop({ required: true })
  expiresAt: Date;
}

export type MoralCacheDocument = HydratedDocument<MoralCache>;
export const MoralCacheSchema = SchemaFactory.createForClass(MoralCache);

MoralCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
