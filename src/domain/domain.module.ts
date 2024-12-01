import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { rbacModule } from './RBAC/rbac.module';
import { MinioModule } from 'src/common/modules/minio/minio.module';
import { FilesModule } from './files/files.module';
import { ProfileModule } from './profile/profile.module';
import { DiscountModule } from './discount/discount.module';
import { BlogModule } from './blog/blog.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    UserModule,
    ProfileModule,
    AuthModule,
    rbacModule,
    DiscountModule,
    BlogModule,
    MinioModule,
    FilesModule,
    ProductModule,
    CategoryModule,
  ],
})
export class DomainModule {}
