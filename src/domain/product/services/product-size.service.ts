import { Injectable } from '@nestjs/common';
import ResourceService from 'src/common/resources/resource-service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductSize } from '../schemas/product-size.schema';

@Injectable()
export class ProductSizeService extends ResourceService(ProductSize, {
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
    @InjectModel(ProductSize.name)
    private readonly productSizeModel: Model<ProductSize>,
  ) {
    super(productSizeModel);
  }
}
