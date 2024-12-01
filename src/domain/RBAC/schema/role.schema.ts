import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserDocument } from 'src/domain/user/schemas/user.schema';
import { PermissionDocument } from './permission.schema';

export type RoleDocument = HydratedDocument<Role>;
@Schema({ timestamps: true })
export class Role {
  @Prop()
  @ApiProperty()
  name?: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    required: false,
    ref: 'Permission',
  })
  @ApiProperty()
  permissions?: PermissionDocument[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
    required: false,
  })
  users?: UserDocument[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: UserDocument | mongoose.Types.ObjectId;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
