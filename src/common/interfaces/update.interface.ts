import { ApiProperty } from '@nestjs/swagger';
import { ObjectId, UpdateResult as mongoUpdateResult } from 'mongodb';

export class UpdateResult implements mongoUpdateResult {
  @ApiProperty()
  acknowledged: boolean;

  @ApiProperty()
  modifiedCount: number;

  @ApiProperty({ type: String })
  upsertedId: ObjectId | null;

  @ApiProperty()
  upsertedCount: number;

  @ApiProperty()
  matchedCount: number;
}
