import { Injectable } from '@nestjs/common';
import ResourceService from 'src/common/resources/resource-service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDetail } from '../schemas/product-detail.schema';

@Injectable()
export class ProductDetailService extends ResourceService(ProductDetail, {
  findAll: {
    populations: [
      {
        path: 'product',
      },
    ],
  },
  findOne: {
    populations: [
      {
        path: 'product',
      },
    ],
  },
}) {
  constructor(
    @InjectModel(ProductDetail.name)
    private readonly productDetailModel: Model<ProductDetail>,
  ) {
    super(productDetailModel);
  }
}
