import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { FilterQuery } from 'mongoose';
import { toInteger } from 'lodash';
import { Type, applyDecorators } from '@nestjs/common';

export const ApiPaginateResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) =>
  applyDecorators(
    ApiExtraModels(PaginateResponseDto<DataDto>, dataDto),
    ApiOkResponse({
      status: 200,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginateResponseDto<DataDto>) },
          {
            properties: {
              meta: { type: 'object' },
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  );

export class PaginateResponseDto<T> {
  @ApiProperty()
  data: T[] | T;
}
const PAGE_SIZE_LIMIT = 100;
export enum Order {
  ASC = 1,
  DESC = -1,
}
export type PaginateQuery<T> = {
  page?: number;
  limit?: number;
  order?: Order;
  orderBy?: string;
  filter?: FilterQuery<T>;
};
export class PaginateQueryDTO<T> implements PaginateQuery<T> {
  constructor(query?: PaginateQueryDTO<T>) {
    if (!query) return;
    for (const [key, value] of Object.entries(query)) {
      this[key] = value;
    }
    this.pageSize = Math.min(query.pageSize || 20, PAGE_SIZE_LIMIT);
    this.page = query.page || 1;
    this.order = toInteger(query.order) || Order.DESC;
    this.orderBy = query.orderBy || 'createdAt';
    this.filter = query.filter || {};
  }
  @ApiProperty({ required: false, default: 1 })
  page?: number = 1;
  @ApiProperty({ required: false, default: 20 })
  limit?: number = 20;
  @ApiProperty({ required: false, enum: Order })
  order?: Order = Order.DESC;
  @ApiProperty({ required: false, type: String })
  orderBy?: string = 'createdAt';
  @ApiProperty({ required: false, type: String })
  filter?: FilterQuery<T> = {};
  [prop: string]: any;
}
