import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoDBService } from './mongodb.service';
import { config } from 'dotenv';
import { User, UserSchema } from 'src/domain/user/schemas/user.schema';
import { Role, RoleSchema } from 'src/domain/RBAC/schema/role.schema';
import {
  Permission,
  PermissionSchema,
} from 'src/domain/RBAC/schema/permission.schema';
import {
  Discount,
  DiscountSchema,
} from 'src/domain/discount/schemas/discount.schema';
import { Blog, BlogSchema } from 'src/domain/blog/schemas/blog.schema';
import {
  Product,
  ProductSchema,
} from 'src/domain/product/schemas/product.schema';
import {
  ProductDetail,
  ProductDetailSchema,
} from 'src/domain/product/schemas/product-detail.schema';
import {
  ProductColor,
  ProductColorSchema,
} from 'src/domain/product/schemas/product-color.schema';
import {
  ProductSize,
  ProductSizeSchema,
} from 'src/domain/product/schemas/product-size.schema';
import {
  ProductComment,
  ProductCommentSchema,
} from 'src/domain/product/schemas/product-comment.schema';
import {
  Category,
  CategorySchema,
} from 'src/domain/category/schemas/category.schema';

config();
@Global()
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Discount.name, schema: DiscountSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Product.name, schema: ProductSchema },
      { name: ProductDetail.name, schema: ProductDetailSchema },
      { name: ProductColor.name, schema: ProductColorSchema },
      { name: ProductSize.name, schema: ProductSizeSchema },
      { name: ProductComment.name, schema: ProductCommentSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  providers: [MongoDBService],
  exports: [MongooseModule],
})
export class MongoDBModule {}
