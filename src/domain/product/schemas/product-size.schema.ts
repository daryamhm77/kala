import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ProductDocument } from './product.schema';
import { ApiProperty } from '@nestjs/swagger';
import { UserDocument } from 'src/domain/user/schemas/user.schema';

export type ProductSizeDocument = HydratedDocument<ProductSize>;

@Schema({ timestamps: true })
export class ProductSize {
  @Prop()
  @ApiProperty()
  size: string;

  @Prop()
  @ApiProperty()
  count: number;

  @Prop({ default: 0 })
  priceAfterDiscount: number;

  @Prop({ type: Number })
  @ApiProperty()
  price: number;

  @Prop({ type: Number, default: 0 })
  @ApiProperty()
  discount: number;

  @Prop({ default: false })
  @ApiProperty()
  active_discount: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  @ApiProperty({ type: String })
  product: ProductDocument;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: UserDocument;
}

export const ProductSizeSchema = SchemaFactory.createForClass(ProductSize);
