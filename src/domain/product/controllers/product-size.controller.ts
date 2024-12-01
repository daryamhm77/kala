import { CustomController } from 'src/common/decorators/controller.decorator';
import { ROLES } from 'src/common/enums/roles.enum';
import ResourceController from 'src/common/resources/resource-controller';
import { ProductSize } from '../schemas/product-size.schema';
import { ProductSizeService } from '../services/product-size.service';
import {
  Body,
  Delete,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { calculateDiscount } from 'src/common/functions/calculate-discount';
import CustomFastifyRequest from 'src/common/interfaces/fastify.interface';

@CustomController({
  path: 'product/size',
  apiTag: 'Product',
  auth: true,
  roles: [ROLES.GOD_ADMIN],
})
export class ProductSizeController extends ResourceController({
  schema: ProductSize,
  service: ProductSizeService,
  options: {
    omitRoutes: ['update'],
  },
}) {
  constructor(
    private readonly productSizeService: ProductSizeService,
    private readonly productService: ProductService,
  ) {
    super(productSizeService);
  }

  @Post()
  async create(
    @Body() productSizeDto: ProductSize,
    @Req() req: CustomFastifyRequest,
  ) {
    const product = await this.productService.validateProductExistence(
      productSizeDto?.product,
    );
    productSizeDto.product = product;
    productSizeDto.creator = req.user;
    productSizeDto.priceAfterDiscount = calculateDiscount(
      productSizeDto.price,
      productSizeDto?.discount,
    );
    const productSize = await this.productSizeService.create(productSizeDto);
    await this.productService.findOneAndUpdate(
      { _id: product._id },
      { $push: { sizes: productSize._id } },
    );
    return productSize;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const productSize = await this.productSizeService.findOne({ _id: id });
    if (!productSize)
      throw new NotFoundException(
        `Product-Size With Id : ${id} does not exist`,
      );
    await this.productService.findOneAndUpdate(
      { _id: productSize.product._id },
      { $pull: { sizes: productSize._id } },
    );
    return this.productSizeService.remove({ _id: productSize._id });
  }
}
