import { Injectable, NotFoundException } from '@nestjs/common';
import ResourceService from 'src/common/resources/resource-service';
import { Product, ProductDocument } from '../schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ObjectId, UpdateQuery } from 'mongoose';
import { MinioService } from 'src/common/modules/minio/minio.service';

@Injectable()
export class ProductService extends ResourceService(Product, {
  findAll: {
    populations: [
      {
        path: 'details',
      },
      {
        path: 'colors',
      },
      {
        path: 'sizes',
      },
      {
        path: 'categories',
      },
    ],
  },
  findOne: {
    populations: [
      {
        path: 'details',
      },
      {
        path: 'colors',
      },
      {
        path: 'sizes',
      },
      {
        path: 'categories',
      },
    ],
  },
}) {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly minioService: MinioService,
  ) {
    super(productModel);
  }

  async validateProductExistence(
    productId: ProductDocument | string | ObjectId,
  ) {
    const product = await this.productModel.findOne({ _id: productId });
    if (!product)
      throw new NotFoundException(
        `Product With Id :${productId} Does not exist`,
      );
    return product;
  }

  findOneAndUpdate(filter: FilterQuery<Product>, object: UpdateQuery<Product>) {
    return this.productModel.findOneAndUpdate(filter, object, { new: true });
  }

  async removeOldImages(newImages: string[], product: ProductDocument) {
    if (newImages?.length == 0) {
      product.images.map((img) => {
        if (img.toString().trim() !== '') {
          this.minioService.deleteFile({ fileName: img });
          const index = product.images.indexOf(img);
          if (index > -1) {
            product.images.splice(index, 1);
          }
        }
      });
    }
    if (newImages && newImages.length > 0) {
      newImages.map(async (newImage) => {
        const oldImage = product.images.find((img) => img !== newImage);
        if (oldImage) {
          !product.images.includes(newImage) &&
            (await this.minioService.deleteFile({
              fileName: oldImage,
            }));
        }
      });
    }
  }

  async removeImages(product: ProductDocument) {
    product.images.map(async (image) => {
      if (image?.toString()?.trim() !== '') {
        await this.minioService.deleteFile({
          fileName: image,
        });
      }
    });
  }
}
