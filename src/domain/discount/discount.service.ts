import { Injectable } from '@nestjs/common';
import ResourceService from 'src/common/resources/resource-service';
import { Discount } from './schemas/discount.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class DiscountService extends ResourceService(Discount) {
  constructor(
    @InjectModel(Discount.name) private readonly discountModel: Model<Discount>,
  ) {
    super(discountModel);
  }
}
