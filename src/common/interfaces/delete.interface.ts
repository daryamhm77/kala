import { ApiProperty } from '@nestjs/swagger';
import { UpdateResult } from './update.interface';
import { ObjectId } from 'mongodb';

export class DeleteResult implements UpdateResult {
  @ApiProperty()
  acknowledged: boolean;

  @ApiProperty()
  matchedCount: number;

  @ApiProperty()
  modifiedCount: number;

  @ApiProperty()
  upsertedCount: number;

  @ApiProperty()
  upsertedId: ObjectId;

  @ApiProperty()
  ok: number; // 1 if successful, 0 otherwise

  @ApiProperty()
  n: number; // Number of documents matched

  @ApiProperty()
  nModified: number; // Number of documents actually modified

  @ApiProperty()
  upserted?: Array<{ index: number; _id: ObjectId }> | ObjectId[]; // Upserted documents
}
