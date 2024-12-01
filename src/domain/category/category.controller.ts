import { CustomController } from 'src/common/decorators/controller.decorator';
import { ROLES } from 'src/common/enums/roles.enum';
import ResourceController from 'src/common/resources/resource-controller';
import { Category } from './schemas/category.schema';
import { CategoryService } from './category.service';
import { Delete, Param, Put } from '@nestjs/common';
import { ProductService } from '../product/services/product.service';

@CustomController({
  apiTag: 'Category',
  path: 'category',
  auth: true,
  roles: [ROLES.CLIENT],
})
export class CategoryController extends ResourceController({
  schema: Category,
  service: CategoryService,
  options: {
    needAdminRole: ['create', 'update', 'remove'],
  },
}) {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
  ) {
    super(categoryService);
  }

  @Put('/:productId/:categoryId')
  async addCategoryToProduct(
    @Param('productId') productId: string,
    @Param('categoryId') categoryId: string,
  ) {
    const product =
      await this.productService.validateProductExistence(productId);
    const category =
      await this.categoryService.validateCategoryExistence(categoryId);
    await this.categoryService.findOneAndUpdate(
      { _id: category._id },
      { $addToSet: { products: product } },
    );
    return await this.productService.findOneAndUpdate(
      { _id: product._id },
      { $addToSet: { categories: category } },
    );
  }

  @Delete('/:productId/:categoryId')
  async removeCategoryFromProduct(
    @Param('productId') productId: string,
    @Param('categoryId') categoryId: string,
  ) {
    const product =
      await this.productService.validateProductExistence(productId);
    const category =
      await this.categoryService.validateCategoryExistence(categoryId);
    await this.categoryService.findOneAndUpdate(
      { _id: category._id },
      { $pull: { products: product._id } },
    );
    return await this.productService.findOneAndUpdate(
      { _id: product._id },
      { $pull: { categories: category._id } },
    );
  }
}
