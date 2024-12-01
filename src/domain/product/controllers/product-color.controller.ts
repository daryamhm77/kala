import { CustomController } from 'src/common/decorators/controller.decorator';
import { ROLES } from 'src/common/enums/roles.enum';
import ResourceController from 'src/common/resources/resource-controller';
import { ProductColor } from '../schemas/product-color.schema';
import { ProductColorService } from '../services/product-color.service';
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
  path: 'product/color',
  apiTag: 'Product',
  auth: true,
  roles: [ROLES.GOD_ADMIN],
})
export class ProductColorController extends ResourceController({
  schema: ProductColor,
  service: ProductColorService,
  options: {
    omitRoutes: ['update'],
  },
}) {
  constructor(
    private readonly productColorService: ProductColorService,
    private readonly productService: ProductService,
  ) {
    super(productColorService);
  }

  @Post()
  async create(
    @Body() productColorDto: ProductColor,
    @Req() req: CustomFastifyRequest,
  ) {
    const product = await this.productService.validateProductExistence(
      productColorDto?.product,
    );
    productColorDto.product = product;
    productColorDto.creator = req.user;
    productColorDto.priceAfterDiscount = calculateDiscount(
      productColorDto.price,
      productColorDto?.discount,
    );
    const productColor = await this.productColorService.create(productColorDto);
    await this.productService.findOneAndUpdate(
      { _id: product._id },
      { $push: { colors: productColor._id } },
    );
    return productColor;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const productColor = await this.productColorService.findOne({ _id: id });
    if (!productColor)
      throw new NotFoundException(
        `Product-Color With Id : ${id} does not exist`,
      );
    await this.productService.findOneAndUpdate(
      { _id: productColor.product._id },
      { $pull: { colors: productColor._id } },
    );
    return this.productColorService.remove({ _id: productColor._id });
  }
}
