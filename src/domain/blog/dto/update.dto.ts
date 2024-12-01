import { PickType } from '@nestjs/swagger';
import { CreateBlogDto } from './create.dto';

export class UpdateBlogDto extends PickType(CreateBlogDto, [
  'title',
  'description',
  'refUrl',
  'authorName',
  'pages',
  'image',
] as const) {}
