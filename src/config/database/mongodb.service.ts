// database.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class MongoDBService implements OnModuleInit {
  private readonly logger = new Logger(MongoDBService.name);
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit() {
    this.logger.log('MongoDB Connected');
    this.logger.debug({
      MongoDB: {
        DB_HOST: this.connection.host,
        DB_NAME: this.connection.name,
        DB_PORT: this.connection.port,
      },
    });
  }
}
