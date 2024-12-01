import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ProductDocument } from './product.schema';
import { ApiProperty } from '@nestjs/swagger';
import { UserDocument } from 'src/domain/user/schemas/user.schema';

export type ProductCommentDocument = HydratedDocument<ProductComment>;

@Schema({ timestamps: true })
export class ProductComment {
  @Prop()
  @ApiProperty()
  message: string;

  @Prop({ default: false })
  isApproved: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  approvedBy: UserDocument;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  @ApiProperty({ type: String })
  product: ProductDocument;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: UserDocument;

  @Prop({
    type: [mongoose.Types.ObjectId],
    ref: 'User',
    required: false,
    default: [],
  })
  likes?: UserDocument[];
}

export const ProductCommentSchema =
  SchemaFactory.createForClass(ProductComment);
