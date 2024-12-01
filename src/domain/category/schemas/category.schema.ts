import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { ProductDocument } from 'src/domain/product/schemas/product.schema';
import { UserDocument } from 'src/domain/user/schemas/user.schema';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({
  timestamps: true,
})
export class Category {
  @Prop()
  @ApiProperty()
  name: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
    required: false,
    default: [],
  })
  products?: ProductDocument[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: UserDocument;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
