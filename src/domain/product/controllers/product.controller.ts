import { CustomController } from 'src/common/decorators/controller.decorator';
import ResourceController from 'src/common/resources/resource-controller';
import { Product } from '../schemas/product.schema';
import { ProductService } from '../services/product.service';
import { Body, Param, Post, Put } from '@nestjs/common';
import { calculateDiscount } from 'src/common/functions/calculate-discount';
import { ROLES } from 'src/common/enums/roles.enum';
import { Roles } from 'src/common/decorators/role.decorator';

@CustomController({
  path: 'product',
  apiTag: 'Product',
  auth: true,
  roles: [ROLES.CLIENT],
})
export class ProductController extends ResourceController({
  schema: Product,
  service: ProductService,
  options: {
    omitRoutes: ['remove', 'create', 'update'],
  },
}) {
  constructor(private readonly productService: ProductService) {
    super(productService);
  }

  @Post()
  @Roles(ROLES.ADMIN)
  async create(@Body() productDto: Product) {
    productDto.priceAfterDiscount = calculateDiscount(
      productDto.price,
      productDto?.discount,
    );
    return await this.productService.create(productDto);
  }

  @Put('/:id')
  @Roles(ROLES.ADMIN)
  async update(@Param('id') id: string, @Body() productDto: Product) {
    const product = await this.productService.validateProductExistence(id);
    await this.productService.removeOldImages(productDto.images, product);
    return await this.productService.updateOne(
      { _id: product._id },
      { ...productDto },
    );
  }

  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   const product = await this.productService.validateProductExistence(id);
  //   await this.productService.removeImages(product);
  //   return await this.productService.remove({ _id: product._id });
  // }
}
