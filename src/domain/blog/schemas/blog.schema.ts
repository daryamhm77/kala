import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserDocument } from 'src/domain/user/schemas/user.schema';

export type BlogDocument = HydratedDocument<Blog>;

@Schema({
  timestamps: true,
})
export class Blog {
  @Prop()
  @ApiProperty()
  title: string;

  @Prop()
  @ApiProperty()
  description: string;

  @Prop()
  @ApiProperty()
  refUrl: string;

  @Prop()
  @ApiProperty()
  authorName: string;

  @Prop()
  @ApiProperty()
  pages: number;

  @Prop({ required: false })
  @ApiProperty()
  image?: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: false })
  @ApiProperty()
  author?: UserDocument;

  @Prop({
    type: [mongoose.Types.ObjectId],
    ref: 'User',
    required: false,
    default: [],
  })
  @ApiProperty({ required: false, default: [] })
  likes?: UserDocument[];

  @Prop({
    type: [mongoose.Types.ObjectId],
    ref: 'User',
    required: false,
    default: [],
  })
  @ApiProperty({ required: false, default: [] })
  saves?: UserDocument[];
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
