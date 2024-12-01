import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { Client } from 'minio';
import minioClient from './minio.client';
import { Readable } from 'stream';
import { AvailableMinIOBuckets } from './buckets';

interface MinioFunctionArguments {
  bucketName?: string;
  fileName?: string;
  fileBuffer?: Buffer;
}

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly minioClient: Client = minioClient;
  private readonly logger = new Logger(MinioService.name);
  private readonly bucketName = AvailableMinIOBuckets.APP_BUCKET;

  async onModuleInit(): Promise<void> {
    const isConnected = await this.checkConnection();
    if (!isConnected) {
      throw new HttpException(
        'Failed to connect to MinIO',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    this.logger.log('MinIo Connected');
    this.logger.debug({
      Minio: {
        host: process.env.MINIO_HOST,
        port: process.env.MINIO_PORT,
        useSSL: process.env.MINIO_USE_SSL,
        app_bucket: process.env.MINIO_APP_BUCKET,
      },
    });
  }

  private async checkConnection(): Promise<boolean> {
    try {
      await this.minioClient.listBuckets();
      return true;
    } catch (error) {
      console.error('Error checking MinIO connection:', error);
      return false;
    }
  }

  async ensureBucketExists({
    bucketName = this.bucketName,
  }: Pick<MinioFunctionArguments, 'bucketName'>): Promise<void> {
    const exists = await this.minioClient.bucketExists(bucketName);
    if (!exists) {
      await this.minioClient.makeBucket(bucketName);
    }
  }

  async fileExists({
    bucketName = this.bucketName,
    fileName,
  }: Omit<MinioFunctionArguments, 'fileBuffer'>): Promise<boolean> {
    try {
      await this.minioClient.statObject(bucketName, fileName);
      return true;
    } catch (error) {
      if (error.code === 'NotFound') {
        return false;
      }
      throw new Error(`Error checking file existence: ${error.message}`);
    }
  }

  async getFile({
    bucketName = this.bucketName,
    fileName,
  }: Omit<MinioFunctionArguments, 'fileBuffer'>): Promise<Readable> {
    try {
      return await this.minioClient.getObject(bucketName, fileName);
    } catch (error) {
      throw new Error(`Error retrieving file: ${error.message}`);
    }
  }

  async uploadFile({
    bucketName = this.bucketName,
    fileName,
    fileBuffer,
  }: MinioFunctionArguments) {
    try {
      return await this.minioClient.putObject(bucketName, fileName, fileBuffer);
    } catch (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }
  }

  async deleteFile({
    bucketName = this.bucketName,
    fileName,
  }: Pick<MinioFunctionArguments, 'bucketName' | 'fileName'>) {
    try {
      return await this.minioClient.removeObject(bucketName, fileName);
    } catch (error) {
      throw new Error(`Error deleting file: ${error.message}`);
    }
  }

  async listObjects({
    bucketName = this.bucketName,
  }: Pick<MinioFunctionArguments, 'bucketName'>): Promise<string[]> {
    try {
      const stream = await this.minioClient.listObjects(bucketName);
      return new Promise<string[]>((resolve, reject) => {
        const fileNames: string[] = [];
        stream.on('data', (obj) => fileNames.push(obj.name));
        stream.on('end', () => resolve(fileNames));
        stream.on('error', reject);
      });
    } catch (error) {
      throw new Error(`Error listing objects: ${error.message}`);
    }
  }
}
