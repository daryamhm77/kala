import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ProductDocument } from './product.schema';
import { ApiProperty } from '@nestjs/swagger';
import { UserDocument } from 'src/domain/user/schemas/user.schema';

export type ProductDetailDocument = HydratedDocument<ProductDetail>;

@Schema({ timestamps: true })
export class ProductDetail {
  @Prop()
  @ApiProperty()
  key: string;

  @Prop()
  @ApiProperty()
  value: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  @ApiProperty({ type: String })
  product: ProductDocument;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: UserDocument;
}

export const ProductDetailSchema = SchemaFactory.createForClass(ProductDetail);
