import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NoAuth } from 'src/common/decorators/no-auth.decorator';
import { ROLES_KEY } from 'src/common/decorators/role.decorator';
import { ROLES } from 'src/common/enums/roles.enum';
import CustomFastifyRequest from 'src/common/interfaces/fastify.interface';
import { Role } from 'src/domain/RBAC/schema/role.schema';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: CustomFastifyRequest = context
      .switchToHttp()
      .getRequest<CustomFastifyRequest>();
    const user = req.user;
    let userRole = user?.role;

    const roles = await this.roleModel.find({});
    const roleNames = roles.map((role) => role.name);

    const requiredRoles = this.reflector.get<typeof roleNames>(
      ROLES_KEY,
      context.getHandler(),
    );

    const noAuth = this.reflector.get(NoAuth, context.getHandler());
    if (noAuth !== undefined) return true;

    const requiredRolesClassHandler = this.reflector.get<typeof roleNames>(
      ROLES_KEY,
      context.getClass(),
    );

    if (!requiredRoles && !requiredRolesClassHandler) return true;

    if (user.role === ROLES.GOD_ADMIN) return true;

    if (!userRole || userRole.toString().trim() === '') {
      req.user.role = ROLES.CLIENT;
      userRole = req.user.role;
      await req.user.save();
    }

    if (requiredRoles && requiredRoles.length > 0) {
      const accessResult = requiredRoles.some((role) => role === userRole);
      if (accessResult) return true;
      throw new ForbiddenException('Forbidden Resource!');
    }

    if (requiredRolesClassHandler && requiredRolesClassHandler.length > 0) {
      const accessResult = requiredRolesClassHandler.some(
        (role) => role === userRole,
      );
      if (accessResult) return true;
      throw new ForbiddenException('Forbidden Resource');
    }

    return true;
  }
}
