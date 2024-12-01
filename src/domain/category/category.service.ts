import { Injectable, NotFoundException } from '@nestjs/common';
import ResourceService from 'src/common/resources/resource-service';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ObjectId, UpdateQuery } from 'mongoose';
import { Category } from './schemas/category.schema';
import { ProductDocument } from '../product/schemas/product.schema';

@Injectable()
export class CategoryService extends ResourceService(Category, {
  findAll: {
    populations: [
      {
        path: 'products',
      },
    ],
  },
  findOne: {
    populations: [
      {
        path: 'products',
      },
    ],
  },
}) {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {
    super(categoryModel);
  }

  findOneAndUpdate(
    filter: FilterQuery<Category>,
    object: UpdateQuery<Category>,
  ) {
    return this.categoryModel.findOneAndUpdate(filter, object, { new: true });
  }

  updateMany(filter: FilterQuery<Category>, object: UpdateQuery<Category>) {
    return this.categoryModel.updateMany(filter, object);
  }

  async validateCategoryExistence(
    categoryId: ProductDocument | string | ObjectId,
  ) {
    const category = await this.categoryModel.findOne({ _id: categoryId });
    if (!category)
      throw new NotFoundException(
        `Category With Id :${categoryId} Does not exist`,
      );
    return category;
  }
}
