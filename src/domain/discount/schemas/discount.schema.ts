import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserDocument } from 'src/domain/user/schemas/user.schema';

export type DiscountDocument = HydratedDocument<Discount>;

@Schema({ timestamps: true })
export class Discount {
  @Prop()
  @ApiProperty()
  code: string;

  @Prop()
  @ApiProperty()
  value: number;

  @Prop({ default: true })
  @ApiProperty()
  active: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: UserDocument;
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);
