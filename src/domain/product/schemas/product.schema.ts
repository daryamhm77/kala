import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ProductDetailDocument } from './product-detail.schema';
import { ProductColorDocument } from './product-color.schema';
import { ApiProperty } from '@nestjs/swagger';
import { ProductType } from '../enum/product-type.enum';
import { ProductSizeDocument } from './product-size.schema';
import { ProductCommentDocument } from './product-comment.schema';
import { UserDocument } from 'src/domain/user/schemas/user.schema';
import { CategoryDocument } from 'src/domain/category/schemas/category.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop()
  @ApiProperty()
  title: string;

  @Prop()
  @ApiProperty()
  description: string;

  @Prop()
  @ApiProperty()
  slug: string;

  @Prop()
  @ApiProperty()
  code: string;

  @Prop({ default: 0 })
  @ApiProperty()
  count: number;

  @Prop({ default: 0 })
  priceAfterDiscount: number;

  @Prop({ type: Number, required: true })
  @ApiProperty()
  price: number;

  @Prop({ type: Number, required: false, default: 0 })
  @ApiProperty()
  discount?: number;

  @Prop({ required: false, default: false })
  @ApiProperty()
  active_discount: boolean;

  @Prop()
  @ApiProperty()
  images?: string[];

  @Prop({ enum: ProductType })
  @ApiProperty({ enum: ProductType })
  type: ProductType;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'ProductDetail',
    required: false,
    default: [],
  })
  details?: ProductDetailDocument[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'ProductColor',
    required: false,
    default: [],
  })
  colors?: ProductColorDocument[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'ProductSize',
    required: false,
    default: [],
  })
  sizes: ProductSizeDocument[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'ProductComment',
    required: false,
    default: [],
  })
  comments: ProductCommentDocument[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Category',
    required: false,
    default: [],
  })
  categories?: CategoryDocument[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: UserDocument;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
