import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserDocument } from 'src/domain/user/schemas/user.schema';

export type PermissionDocument = HydratedDocument<Permission>;

@Schema({ timestamps: true })
export class Permission {
  @Prop()
  @ApiProperty()
  name: string;

  @Prop({
    required: false,
  })
  @ApiProperty()
  description?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: UserDocument;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
