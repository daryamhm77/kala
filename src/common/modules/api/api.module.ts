import { Module } from '@nestjs/common';
import { ApiService } from './api.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ApiService],
  exports: [ApiService],
})
export class ApiModule {}
