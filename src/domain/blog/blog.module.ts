import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { ApiService } from 'src/common/modules/api/api.service';
import { MinioService } from 'src/common/modules/minio/minio.service';

@Module({
  imports: [],
  controllers: [BlogController],
  providers: [BlogService, AuthService, ApiService, UserService, MinioService],
})
export class BlogModule {}
