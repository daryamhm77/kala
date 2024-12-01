import { CustomController } from 'src/common/decorators/controller.decorator';
import { ROLES } from 'src/common/enums/roles.enum';
import { ProductComment } from '../schemas/product-comment.schema';
import { ProductCommentService } from '../services/product-comment.service';
import {
  Body,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import CustomFastifyRequest from 'src/common/interfaces/fastify.interface';
import { ProductService } from '../services/product.service';
import { UserService } from 'src/domain/user/user.service';
import { Roles } from 'src/common/decorators/role.decorator';
import { PaginateQuery } from 'src/common/dto/paginate-query.dto';

@CustomController({
  path: 'product/comment',
  apiTag: 'Product',
  auth: true,
  roles: [ROLES.CLIENT],
})
export class ProductCommentController {
  constructor(
    private readonly productCommentService: ProductCommentService,
    private readonly productService: ProductService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async create(
    @Body() commentDto: ProductComment,
    @Req() req: CustomFastifyRequest,
  ) {
    const product = await this.productService.validateProductExistence(
      commentDto.product,
    );
    commentDto.creator = req.user;
    commentDto.product = product;
    const comment = await this.productCommentService.create(commentDto);
    await this.productService.findOneAndUpdate(
      { _id: product._id },
      { $push: { comments: comment } },
    );
    await this.userService.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { comments: comment } },
    );
    return comment;
  }

  @Get()
  async findAll(
    @Query() query: PaginateQuery<ProductComment>,
    @Req() req: CustomFastifyRequest,
  ) {
    query.filter = {
      ...query.filter,
      creator: req.user._id,
    };
    return this.productCommentService.findAll(query);
  }

  @Get('/list/admin')
  @Roles(ROLES.ADMIN)
  async findAllByAdmin(@Query() query: PaginateQuery<ProductComment>) {
    return this.productCommentService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: CustomFastifyRequest) {
    return this.productCommentService.findOne({
      _id: id,
      creator: req.user._id,
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() commentDto: ProductComment,
    @Req() req: CustomFastifyRequest,
  ) {
    const comment = await this.productCommentService.findOne({
      _id: id,
      creator: req.user._id,
    });
    if (!comment)
      throw new NotFoundException(
        `Comment of product with id : ${id} not found`,
      );
    Object.assign(comment, {
      message: commentDto.message,
    });
    return await comment.save();
  }

  @Get('/approve/:id')
  @Roles(ROLES.ADMIN)
  async approveComment(
    @Param('id') id: string,
    @Req() req: CustomFastifyRequest,
  ) {
    const productComment = await this.productCommentService.findOne({
      _id: id,
      isApproved: false,
    });
    if (!productComment)
      throw new NotFoundException(
        `Comment of product with id : ${id} not found`,
      );
    return await this.productCommentService.updateOne(
      { _id: productComment._id },
      { approvedBy: req.user, isApproved: true },
    );
  }

  @Delete(':id')
  @Roles(ROLES.ADMIN)
  async remove(@Param('id') id: string, @Req() req: CustomFastifyRequest) {
    const comment = await this.productCommentService.findOne({
      _id: id,
      creator: req.user._id,
    });
    if (!comment)
      throw new NotFoundException(
        `Comment of product with id : ${id} not found`,
      );
    await this.productService.findOneAndUpdate(
      { _id: comment.product._id },
      { $pull: { comments: comment._id } },
    );
    await this.userService.findOneAndUpdate(
      { _id: req.user._id },
      { $pull: { comments: comment._id } },
    );
    return await this.productCommentService.remove({ _id: comment._id });
  }
}
