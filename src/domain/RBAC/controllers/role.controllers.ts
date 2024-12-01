import { CustomController } from 'src/common/decorators/controller.decorator';
import { ROLES } from 'src/common/enums/roles.enum';
import ResourceController from 'src/common/resources/resource-controller';
import { Role } from '../schema/role.schema';
import { RoleService } from '../services/role.service';
import { Body, NotFoundException, Post, Req } from '@nestjs/common';
import CustomFastifyRequest from 'src/common/interfaces/fastify.interface';
import { PermissionDocument } from '../schema/permission.schema';
import { PermissionService } from '../services/permission.service';

@CustomController({
  apiTag: 'RBAC',
  auth: true,
  roles: [ROLES.GOD_ADMIN],
  path: 'role',
})
export class RoleController extends ResourceController({
  schema: Role,
  service: RoleService,
  options: {
    omitRoutes: ['remove'],
  },
}) {
  constructor(
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
  ) {
    super(roleService);
  }

  @Post()
  async create(@Body() createRoleDto: Role, @Req() req: CustomFastifyRequest) {
    createRoleDto.creator = req.user._id;
    await this.validateAssignedPermissions(createRoleDto?.permissions);
    return this.roleService.create(createRoleDto);
  }

  private async validateAssignedPermissions(permissions: PermissionDocument[]) {
    if (!permissions || permissions?.length <= 0) return;
    const existPermissions = await this.permissionService.find({
      _id: { $in: permissions },
    });
    if (existPermissions.length !== permissions.length) {
      throw new NotFoundException(`Some Permissions Not Found.`);
    }
  }
}
