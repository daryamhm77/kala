import { CustomController } from 'src/common/decorators/controller.decorator';
import { ROLES } from 'src/common/enums/roles.enum';
import ResourceController from 'src/common/resources/resource-controller';
import { ProductDetailService } from '../services/product-detail.service';
import { ProductDetail } from '../schemas/product-detail.schema';
import { ProductService } from '../services/product.service';
import {
  Body,
  Delete,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import CustomFastifyRequest from 'src/common/interfaces/fastify.interface';

@CustomController({
  path: 'product/detail',
  apiTag: 'Product',
  auth: true,
  roles: [ROLES.GOD_ADMIN],
})
export class ProductDetailController extends ResourceController({
  schema: ProductDetail,
  service: ProductDetailService,
  options: {
    omitRoutes: ['update'],
  },
}) {
  constructor(
    private readonly productDetailService: ProductDetailService,
    private readonly productService: ProductService,
  ) {
    super(productDetailService);
  }

  @Post()
  async create(
    @Body() productDetailDto: ProductDetail,
    @Req() req: CustomFastifyRequest,
  ) {
    const product = await this.productService.validateProductExistence(
      productDetailDto?.product,
    );
    productDetailDto.product = product;
    productDetailDto.creator = req.user;
    const productDetail =
      await this.productDetailService.create(productDetailDto);
    await this.productService.findOneAndUpdate(
      { _id: product._id },
      { $push: { details: productDetail._id } },
    );
    return productDetail;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const productDetail = await this.productDetailService.findOne({ _id: id });
    if (!productDetail)
      throw new NotFoundException(
        `Product-Detail With Id : ${id} does not exist`,
      );
    await this.productService.findOneAndUpdate(
      { _id: productDetail.product._id },
      { $pull: { details: productDetail._id } },
    );
    return this.productDetailService.remove({ _id: productDetail._id });
  }
}
