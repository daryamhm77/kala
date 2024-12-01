import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
  Scope,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as QueryString from 'qs';
import { FilterQuery } from 'mongoose';
import { PaginateQueryDTO } from '../dto/paginate-query.dto';
import CustomFastifyRequest from '../interfaces/fastify.interface';

@Injectable({ scope: Scope.TRANSIENT })
export class QueryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: CustomFastifyRequest = context.switchToHttp().getRequest();
    request.query = new PaginateQueryDTO(
      request.query as PaginateQueryDTO<unknown>,
    );
    try {
      const mongooseQuery = decodeUrlToMongoFilter(request.query?.filter);
      request.query.filter = mongooseQuery;
      return next.handle();
    } catch (error) {
      throw new HttpException(
        error.message || `failed to decode url query`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

function decodeUrlToMongoFilter(filter: any): FilterQuery<unknown> {
  if (!filter) return {};
  let obj: Record<string, any> = QueryString.parse(
    Array.isArray(filter) ? filter.join('&') : filter,
    {
      ignoreQueryPrefix: true,
      strictNullHandling: true,
    },
  );
  obj = convertContainsToRegex(obj);
  obj = convertStringToArrayOrNumericOrDate(obj);
  obj = convertToObjectWithDotNotation(obj);
  resolveArrays(obj, '$and', '$or', '$nor');
  return obj;
}
function resolveArrays(
  obj: Record<string, any>,
  ...arrayProps: ('$and' | '$or' | '$nor' | string)[]
) {
  for (const prop of arrayProps) {
    if (!obj[prop]) continue;
    const arrayOfConditions = Object.entries(obj[prop]).map(([key, value]) => {
      return { [key]: value };
    });
    obj[prop] = arrayOfConditions;
  }
}
function convertContainsToRegex(obj: Record<string, any>) {
  obj = JSON.parse(
    JSON.stringify(obj).replaceAll('"$contains"', '"$options":"i","$regex"'),
  );
  return obj;
}
function convertStringToArrayOrNumericOrDate(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      if (!key.startsWith('$')) {
        obj[key] = convertStringToArrayOrNumericOrDate(obj[key]);
      } else {
        convertStringToArrayOrNumericOrDate(obj[key]);
      }
    } else if (typeof obj[key] === 'string') {
      try {
        const parsedValue = JSON.parse(obj[key]);
        if (Array.isArray(parsedValue)) {
          obj[key] = parsedValue;
        } else {
          // const numericValue = Number(obj[key]);
          // if (!isNaN(numericValue)) {
          //   obj[key] = numericValue;
          // } else {
          //   const dateValue = new Date(obj[key]);
          //   if (!isNaN(dateValue.getTime())) {
          //     obj[key] = dateValue;
          //   }
          // }
          //NOTE : now we don't need to convert string to numeric value;
        }
      } catch (error) {
        // Ignore error, it means the value is not a valid JSON array string
      }
    }
  }
  return obj;
}
function convertToObjectWithDotNotation(obj) {
  const newObj = {};
  for (const key in obj) {
    if (typeof obj[key] === 'object' && !key.startsWith('$')) {
      const nestedObj = convertToObjectWithDotNotation(obj[key]);
      if (
        Object.keys(nestedObj).length === 1 &&
        !Object.keys(nestedObj)[0].startsWith('$')
      ) {
        newObj[`${key}.${Object.keys(nestedObj)[0]}`] =
          nestedObj[Object.keys(nestedObj)[0]];
      } else {
        newObj[key] = nestedObj;
      }
    } else {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}
