/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ApiPaginateResponse,
  PaginateQuery,
  PaginateQueryDTO,
} from '../dto/paginate-query.dto';
import {
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { CustomController } from '../decorators/controller.decorator';
import { CustomControllerOptions } from '../interfaces/controller.interface';
import { kebabCase } from 'lodash';
import { plural } from 'pluralize';
import { ResourceInterface } from '../interfaces/resource.interface';
import CustomFastifyRequest from '../interfaces/fastify.interface';
import { Roles } from '../decorators/role.decorator';
import { ROLES } from '../enums/roles.enum';
import { DeleteResult } from '../interfaces/delete.interface';
import { RoleGuard } from 'src/domain/auth/guard/role.guard';

type ResourceControllerOptions<T> = Partial<CustomControllerOptions> & {
  omitRoutes?: (keyof ResourceInterface)[];
  needAdminRole?: (keyof ResourceInterface)[];
  routeOptions?: {
    [prop in keyof ResourceInterface]?: {
      decorators?: MethodDecorator[];
      bodyDto?: any;
      responseDto?: any;
      queryDto?: any;
    };
  };
};
/**
 * @description please make sure to use @CustomController on the main controller if you want to be able to inject services to the controller
 */
export default function ResourceController<T, R>({
  schema,
  service,
  options = {
    path: kebabCase(plural(schema.name)),
  },
}: {
  schema: new () => T;
  service: R;
  options?: ResourceControllerOptions<T>;
}) {
  if (!options.path) options.path = kebabCase(plural(schema.name));
  const {
    create: createOptions,
    findAll: findAllOptions,
    findOne: findOneOptions,
    remove: removeOptions,
    update: updateOptions,
  } = options?.routeOptions || {};
  @CustomController(options as CustomControllerOptions)
  class ResourceController implements ResourceInterface {
    //@ts-expect-error value as type
    constructor(public readonly resourceService: service) {}

    @EnableRoute(
      options,
      Post(),
      ApiBody({
        type: createOptions?.bodyDto || schema,
      }),
      ApiOkResponse({ type: createOptions?.responseDto || schema }),
    )
    create(@Body() body: any, @Req() req: CustomFastifyRequest) {
      this.resourceService.getModel().schema?.paths?.creator &&
        (body.creator = req.user._id);
      return this.resourceService.create(body);
    }

    @EnableRoute(
      options,
      Get(),
      ApiQuery({
        type: findAllOptions?.queryDto || PaginateQueryDTO<T>,
      }),
      ApiPaginateResponse(findAllOptions?.responseDto || schema),
    )
    findAll(
      @Query() query: PaginateQuery<T>,
      @Req() req: CustomFastifyRequest,
    ) {
      return this.resourceService.findAll(query);
    }

    @EnableRoute(
      options,
      Get(':id'),
      ApiOkResponse({ type: findOneOptions?.responseDto || schema }),
    )
    findOne(@Param('id') id: string, @Req() req: CustomFastifyRequest) {
      return this.resourceService.findOne({ _id: id });
    }

    @EnableRoute(
      options,
      Put(':id'),
      ApiBody({
        type: createOptions?.bodyDto || schema,
      }),
      ApiOkResponse({ type: updateOptions?.responseDto || schema }),
    )
    update(
      @Param('id') id: string,
      @Body() body: any,
      @Req() req: CustomFastifyRequest,
    ) {
      return this.resourceService.updateOne({ _id: id }, body);
    }

    @EnableRoute(
      options,
      Delete(':id'),
      ApiOkResponse({ type: removeOptions?.responseDto || DeleteResult }),
    )
    remove(@Param('id') id: string, @Req() req: CustomFastifyRequest) {
      return this.resourceService.removeById(id);
    }
  }
  return ResourceController;
}

function EnableRoute(
  options: ResourceControllerOptions<unknown>,
  ...decorators: MethodDecorator[]
) {
  return (target, key, descriptor) => {
    if (options.omitRoutes?.includes(key)) return;
    if (options.needAdminRole?.includes(key)) {
      decorators.push(Roles(ROLES.ADMIN));
    }
    applyRouteDecorators(
      [...decorators, ...(options.routeOptions?.[key]?.decorators || [])],
      target,
      key,
      descriptor,
    );
  };
}

function applyRouteDecorators(
  decorators: MethodDecorator[],
  target: any,
  key: string,
  descriptor: PropertyDescriptor,
) {
  decorators.forEach((decorator) => {
    decorator(target, key, descriptor);
  });
}
