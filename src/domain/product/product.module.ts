import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { AuthService } from '../auth/auth.service';
import { ApiService } from 'src/common/modules/api/api.service';
import { UserService } from '../user/user.service';
import { ProductDetailController } from './controllers/product-detail.controller';
import { ProductColorController } from './controllers/product-color.controller';
import { ProductSizeController } from './controllers/product-size.controller';
import { ProductDetailService } from './services/product-detail.service';
import { ProductColorService } from './services/product-color.service';
import { ProductSizeService } from './services/product-size.service';
import { ProductCommentController } from './controllers/product-comment.controller';
import { ProductCommentService } from './services/product-comment.service';
import { MinioService } from 'src/common/modules/minio/minio.service';

@Module({
  imports: [],
  controllers: [
    ProductController,
    ProductDetailController,
    ProductColorController,
    ProductSizeController,
    ProductCommentController,
  ],
  providers: [
    ProductService,
    ProductDetailService,
    ProductColorService,
    ProductSizeService,
    ProductCommentService,
    AuthService,
    ApiService,
    UserService,
    MinioService,
  ],
})
export class ProductModule {}
