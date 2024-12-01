import { CustomController } from 'src/common/decorators/controller.decorator';
import { BlogService } from './blog.service';
import { ROLES } from 'src/common/enums/roles.enum';
import { Blog } from './schemas/blog.schema';
import {
  Body,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import CustomFastifyRequest from 'src/common/interfaces/fastify.interface';
import { CreateBlogDto } from './dto/create.dto';
import { UpdateBlogDto } from './dto/update.dto';
import { UserService } from '../user/user.service';
import { Roles } from 'src/common/decorators/role.decorator';
import ResourceController from 'src/common/resources/resource-controller';
import { MinioService } from 'src/common/modules/minio/minio.service';
import { NoAuth } from 'src/common/decorators/no-auth.decorator';
import { PaginateQueryDTO } from 'src/common/dto/paginate-query.dto';

@CustomController({
  path: 'blog',
  apiTag: 'Blog',
  roles: [ROLES.CLIENT],
})
export class BlogController extends ResourceController({
  schema: Blog,
  service: BlogService,
  options: {
    omitRoutes: ['update', 'remove'],
  },
}) {
  constructor(
    private readonly blogService: BlogService,
    private readonly userService: UserService,
    private readonly minioService: MinioService,
  ) {
    super(blogService);
  }

  @Post()
  @Roles(ROLES.ADMIN)
  async create(
    @Body() createBlogDto: CreateBlogDto,
    @Req() req: CustomFastifyRequest,
  ) {
    createBlogDto.author = req.user;
    return this.blogService.create(createBlogDto);
  }

  @Put('/:id')
  @Roles(ROLES.ADMIN)
  async updateBlog(
    @Body() updateBlogDto: UpdateBlogDto,
    @Param('id') id: string,
  ) {
    if (updateBlogDto?.image) {
      const oldCourse = await this.blogService.findById(id);
      if (
        oldCourse?.image?.toString()?.trim() !== '' &&
        updateBlogDto.image !== oldCourse.image
      ) {
        await this.minioService.deleteFile({ fileName: oldCourse.image });
      }
    }
    return this.blogService.updateOne({ _id: id }, updateBlogDto);
  }

  @Get()
  @NoAuth()
  findAll(@Query() query: PaginateQueryDTO<Blog>) {
    return this.blogService.findAll(query);
  }

  @Get('/like/:id')
  async likeBlog(@Param('id') id: string, @Req() req: CustomFastifyRequest) {
    const user = req.user;
    const blog = await this.blogService.findOne({ _id: id });
    if (!blog) throw new NotFoundException('Blog Not Found');

    const userExist = blog.likes.some(
      (like) => like._id.toString() === user._id.toString(),
    );
    if (userExist) {
      await this.blogService.updateOne({ _id: blog._id }, {
        $pull: { likes: user._id },
      } as any);
      await this.userService.updateOne({ _id: user._id }, {
        $pull: { likes: blog._id },
      } as any);
    } else {
      await this.blogService.updateOne({ _id: blog._id }, {
        $push: { likes: user._id },
      } as any);
      await this.userService.updateOne({ _id: user._id }, {
        $push: { likes: blog._id },
      } as any);
    }
    return await this.blogService.findOne({ _id: id });
  }

  @Get('/save/:id')
  async saveBlog(@Param('id') id: string, @Req() req: CustomFastifyRequest) {
    const user = req.user;
    const blog = await this.blogService.findOne({ _id: id });
    if (!blog) throw new NotFoundException('Blog Not Found');

    const userExist = blog.saves.some(
      (save) => save._id.toString() === user._id.toString(),
    );
    if (userExist) {
      await this.blogService.updateOne({ _id: blog._id }, {
        $pull: { saves: user._id },
      } as any);
      await this.userService.updateOne({ _id: user._id }, {
        $pull: { saves: blog._id },
      } as any);
    } else {
      await this.blogService.updateOne({ _id: blog._id }, {
        $push: { saves: user._id },
      } as any);
      await this.userService.updateOne({ _id: user._id }, {
        $push: { saves: blog._id },
      } as any);
    }
    return await this.blogService.findOne({ _id: id });
  }
}
