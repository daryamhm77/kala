import { PickType } from '@nestjs/swagger';
import { Blog } from '../schemas/blog.schema';

export class CreateBlogDto extends PickType(Blog, [
  'title',
  'description',
  'refUrl',
  'authorName',
  'pages',
  'author',
  'image',
] as const) {}
