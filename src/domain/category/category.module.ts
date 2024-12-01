import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { AuthService } from '../auth/auth.service';
import { ApiService } from 'src/common/modules/api/api.service';
import { UserService } from '../user/user.service';
import { ProductService } from '../product/services/product.service';
import { MinioService } from 'src/common/modules/minio/minio.service';

@Module({
  imports: [],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    AuthService,
    ApiService,
    UserService,
    ProductService,
    MinioService,
  ],
})
export class CategoryModule {}
