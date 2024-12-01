// response.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Scope,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import CustomFastifyRequest from '../interfaces/fastify.interface';
import { isValidObjectId } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomResponseInterceptor<T>
  implements NestInterceptor<T, { data: T; meta: any }>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ data: T; meta: any }> {
    const request: CustomFastifyRequest = context.switchToHttp().getRequest();
    sanitizeMongoDbIds(request);
    const startRequestTime = performance.now();
    const isFileResponse =
      (context.getType() === 'http' &&
        context.getHandler().name === 'sendFileHandler') ||
      context.getHandler().name === 'getFavicon';

    if (isFileResponse) {
      // Do not apply formatting to file responses
      return next.handle();
    }
    return next.handle().pipe(
      map((data) => {
        return {
          data: data?.result || data,
          meta: {
            elapsed: `${(performance.now() - startRequestTime).toFixed(0)}ms`,
            ...(data?.searchQuery
              ? { current_page: Number(data?.searchQuery?.page) }
              : {}),
            ...(data?.totalCount ? { total: Number(data?.totalCount) } : {}),
          },
        };
      }),
    );
  }
}
function sanitizeMongoDbIds(request: CustomFastifyRequest<unknown>) {
  const parts = ['params', 'query', 'body'];
  for (const part of parts) {
    request[part] &&
      Object.entries(request[part]).forEach(([key, value]) => {
        if (isNaN(value as any) && isValidObjectId(value)) {
          request[part][key] = new ObjectId(value as string);
        }
      });
  }
}
