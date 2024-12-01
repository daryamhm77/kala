import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { createHash } from 'crypto';
import { FastifyRequest } from 'fastify';
import { MinioService } from '../minio.service';
import { AvailableMinIOBuckets } from '../buckets';

export function MINIOInterceptor(
  bucketName: string | AvailableMinIOBuckets = AvailableMinIOBuckets.APP_BUCKET,
) {
  @Injectable()
  class MINIOInterceptor implements NestInterceptor {
    constructor(public readonly minioService: MinioService) {}

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      try {
        const request: FastifyRequest = context.switchToHttp().getRequest();
        await this.processRequestBody(request);
        return next.handle().pipe(map((data) => data));
      } catch (error) {
        console.error(error);
        const errorMessage = `could not upload the file:\n${
          error.response || error.message || error
        }`;
        throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    public async processRequestBody(request: FastifyRequest): Promise<void> {
      const bodyProcessingPromises = Object.entries(request.body).map(
        async ([key, value]) => {
          if (Array.isArray(value)) {
            return this.processArrayField(key, value);
          }
          if (value.type == 'file') {
            return this.processFileField(key, value);
          }
          return [key, value.value];
        },
      );

      request.body = Object.fromEntries(
        await Promise.all(bodyProcessingPromises),
      );
    }

    public async processArrayField(
      key: string,
      fileList: any[],
    ): Promise<[string, any]> {
      const processedFiles = await this.handleMultipleFiles(fileList);
      return [key, processedFiles];
    }

    public async processFileField(
      key: string,
      file: any,
    ): Promise<[string, any]> {
      const { minIOFileName } = await this.handleFile(file);
      return [key, minIOFileName];
    }

    public async handleMultipleFiles(fileList: any[]): Promise<string[]> {
      return Promise.all(
        fileList.map((fileItem) => this.processFileItem(fileItem)),
      );
    }

    public async processFileItem(fileItem: any): Promise<string> {
      const { minIOFileName } = await this.handleFile(fileItem);
      return minIOFileName;
    }

    public async handleFile(
      fileField,
    ): Promise<{ uploadedFile: any; minIOFileName: string }> {
      try {
        const buffer = await fileField.toBuffer();
        const minIOFileName = this.constructFileName(
          fileField.filename,
          buffer,
        );
        const uploadedFile = await this.minioService.uploadFile({
          bucketName,
          fileName: minIOFileName,
          fileBuffer: buffer,
        });
        return { uploadedFile, minIOFileName };
      } catch (error) {
        console.error('Error handling file:', error);
        throw new Error('Error in handleFile function');
      }
    }

    public constructFileName(fileName: string, buffer: Buffer): string {
      const fileNameRegex = /^(.+)\.([^\.]+)$/;
      const [extension] = fileName.match(fileNameRegex);
      const sha256Hash = this.calculateSha256(buffer);
      return `${sha256Hash}.${extension}`;
    }

    public calculateSha256(buffer: Buffer): string {
      const hash = createHash('sha256');
      hash.update(buffer);
      return hash.digest('hex');
    }
  }
  return MINIOInterceptor;
}
