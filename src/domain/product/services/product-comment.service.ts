import { Injectable } from '@nestjs/common';
import ResourceService from 'src/common/resources/resource-service';
import { ProductComment } from '../schemas/product-comment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductCommentService extends ResourceService(ProductComment, {
  findAll: { populations: [{ path: 'product' }] },
  findOne: { populations: [{ path: 'product' }] },
}) {
  constructor(
    @InjectModel(ProductComment.name)
    private readonly productCommentModel: Model<ProductComment>,
  ) {
    super(productCommentModel);
  }
}
