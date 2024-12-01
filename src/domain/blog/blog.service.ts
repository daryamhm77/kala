import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './schemas/blog.schema';
import { Model } from 'mongoose';
import ResourceService from 'src/common/resources/resource-service';

@Injectable()
export class BlogService extends ResourceService(Blog, {
  findAll: {
    populations: [
      {
        path: 'author',
        select: '_id fullName mobile role',
      },
      {
        path: 'likes',
        select: '_id fullName mobile role',
      },
      {
        path: 'saves',
        select: '_id fullName mobile role',
      },
    ],
  },
  findOne: {
    populations: [
      {
        path: 'author',
        select: '_id fullName mobile role',
      },
      {
        path: 'likes',
        select: '_id fullName mobile role',
      },
      {
        path: 'saves',
        select: '_id fullName mobile role',
      },
    ],
  },
}) {
  constructor(@InjectModel(Blog.name) private readonly blogModel: Model<Blog>) {
    super(blogModel);
  }
}
