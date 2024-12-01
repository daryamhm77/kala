import { Injectable } from '@nestjs/common';
import ResourceService from 'src/common/resources/resource-service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductColor } from '../schemas/product-color.schema';

@Injectable()
export class ProductColorService extends ResourceService(ProductColor, {
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
    @InjectModel(ProductColor.name)
    private readonly productColorModel: Model<ProductColor>,
  ) {
    super(productColorModel);
  }
}
